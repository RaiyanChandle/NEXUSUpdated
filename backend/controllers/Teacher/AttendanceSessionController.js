import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export const createAttendanceSession = async (req, res) => {
  try {
    const { subjectId, classId, date, startTime, endTime, topic } = req.body;
    const teacherId = req.Teacherid;
    if (!subjectId || !classId || !date || !startTime || !endTime || !topic) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const session = await prisma.attendanceSession.create({
      data: {
        subjectId,
        classId,
        teacherId,
        date: new Date(date),
        startTime,
        endTime,
        topic,
      },
    });
    res.status(201).json({ session });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const sendAverageAttendanceEmails = async (req, res) => {
  try {
    const { subjectId, classId } = req.body;
    const teacherId = req.Teacherid;
    if (!subjectId || !classId) return res.status(400).json({ message: 'Missing subjectId or classId' });

    const teach = await prisma.teacherSubjectClass.findFirst({ where: { teacherId, subjectId, classId } });
    if (!teach) return res.status(403).json({ message: 'Forbidden' });

    const subject = await prisma.subject.findUnique({ where: { id: subjectId }, include: { class: true } });
    const cls = await prisma.class.findUnique({ where: { id: classId } });

    const sessions = await prisma.attendanceSession.findMany({ where: { subjectId, classId }, select: { id: true } });
    const sessionIds = sessions.map(s => s.id);

    const enrollments = await prisma.enrollment.findMany({ where: { subjectId, classId }, include: { student: true } });
    const students = enrollments.map(e => e.student);

    const records = sessionIds.length > 0
      ? await prisma.attendanceRecord.findMany({ where: { sessionId: { in: sessionIds } }, select: { studentId: true, present: true } })
      : [];

    const totalSessions = sessionIds.length;
    const presentCountMap = {};
    for (const r of records) {
      if (!presentCountMap[r.studentId]) presentCountMap[r.studentId] = 0;
      if (r.present) presentCountMap[r.studentId] += 1;
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const from = process.env.EMAIL_FROM || user;
    if (!host || !user || !pass) return res.status(500).json({ message: 'Email transport is not configured' });

    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

    const subjectLine = `Average Attendance: ${subject?.name || ''} (${cls?.name || ''})`;

    const tasks = students.map(stu => {
      const present = presentCountMap[stu.id] || 0;
      const percent = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;
      const html = `
        <div>
          <p>Dear ${stu.name},</p>
          <p>Your average attendance for the subject/class is:</p>
          <ul>
            <li>Subject: ${subject?.name || '-'}</li>
            <li>Class: ${cls?.name || '-'}</li>
            <li>Sessions Attended: ${present} / ${totalSessions}</li>
            <li>Average: <strong>${percent}%</strong></li>
          </ul>
          <p>Regards,<br/>NEXUS</p>
        </div>
      `;
      return transporter.sendMail({ from, to: stu.email, subject: subjectLine, html }).catch(() => null);
    });

    const results = await Promise.all(tasks);
    const sent = results.filter(Boolean).length;
    res.json({ success: true, sent, total: students.length });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const getSessionsForCourse = async (req, res) => {
  try {
    const { subjectId, classId } = req.query;
    if (!subjectId || !classId) return res.status(400).json({ message: 'Missing subjectId or classId' });
    const sessions = await prisma.attendanceSession.findMany({
      where: { subjectId, classId },
      orderBy: { date: 'desc' },
    });
    res.json({ sessions });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const getAttendanceForSession = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: 'Missing sessionId' });
    const records = await prisma.attendanceRecord.findMany({
      where: { sessionId },
      include: { student: true },
    });
    res.json({ records });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { sessionId, records } = req.body;
    if (!sessionId || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Missing sessionId or records' });
    }
    // records: [{ studentId, present }]
    const upserts = await Promise.all(records.map(r =>
      prisma.attendanceRecord.upsert({
        where: { sessionId_studentId: { sessionId, studentId: r.studentId } },
        update: { present: r.present },
        create: { sessionId, studentId: r.studentId, present: r.present },
      })
    ));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const sendAttendanceEmails = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Missing sessionId' });

    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: true,
        class: true,
        teacher: true,
        records: { include: { student: true } },
      },
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.teacherId !== req.Teacherid) return res.status(403).json({ message: 'Forbidden' });
    if (!session.records || session.records.length === 0) return res.status(400).json({ message: 'No attendance records found for this session' });

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const from = process.env.EMAIL_FROM || user;

    if (!host || !user || !pass) return res.status(500).json({ message: 'Email transport is not configured' });

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const dateStr = new Date(session.date).toLocaleDateString();
    const subjectLine = `Attendance: ${session.topic} - ${session.subject.name} (${session.class.name}) - ${dateStr}`;

    const tasks = session.records.map(r => {
      const status = r.present ? 'Present' : 'Absent';
      const to = r.student.email;
      const html = `
        <div>
          <p>Dear ${r.student.name},</p>
          <p>Your attendance for the session is recorded as <strong>${status}</strong>.</p>
          <ul>
            <li>Subject: ${session.subject.name}</li>
            <li>Class: ${session.class.name}</li>
            <li>Date: ${dateStr}</li>
            <li>Time: ${session.startTime} - ${session.endTime}</li>
            <li>Topic: ${session.topic}</li>
          </ul>
          <p>Regards,<br/>NEXUS</p>
        </div>
      `;
      return transporter.sendMail({ from, to, subject: subjectLine, html }).catch(() => null);
    });

    const results = await Promise.all(tasks);
    const sent = results.filter(Boolean).length;
    res.json({ success: true, sent, total: session.records.length });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
