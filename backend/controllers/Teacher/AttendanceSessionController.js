import { PrismaClient } from '@prisma/client';

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
