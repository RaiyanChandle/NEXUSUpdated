import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeacherCoursesAndClasses = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    // Get all subject/class pairs this teacher teaches
    const teacherSubjects = await prisma.teacherSubjectClass.findMany({
      where: { teacherId },
      include: {
        subject: true,
        class: true,
      },
    });
    res.json({ courses: teacherSubjects });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const getStudentsForCourseClass = async (req, res) => {
  try {
    const { subjectId, classId } = req.query;
    if (!subjectId || !classId) return res.status(400).json({ message: 'Missing subjectId or classId' });
    // Get all students enrolled in this subject/class
    const enrollments = await prisma.enrollment.findMany({
      where: { subjectId, classId },
      include: { student: true },
    });
    const students = enrollments.map(e => e.student);
    res.json({ students });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};


// Get students with average attendance for a subject/class
export const getStudentsWithAttendance = async (req, res) => {
  try {
    const { subjectId, classId } = req.query;
    if (!subjectId || !classId) return res.status(400).json({ message: 'Missing subjectId or classId' });
    // Get all students enrolled in this subject/class
    const enrollments = await prisma.enrollment.findMany({
      where: { subjectId, classId },
      include: { student: true }
    });
    // Get all attendance sessions for this subject/class
    const sessions = await prisma.attendanceSession.findMany({
      where: { subjectId, classId },
      select: { id: true }
    });
    const sessionIds = sessions.map(s => s.id);
    // Get all attendance records for these sessions
    const records = await prisma.attendanceRecord.findMany({
      where: { sessionId: { in: sessionIds } },
      select: { studentId: true, present: true }
    });
    // Calculate average attendance for each student
    const attendanceMap = {};
    for (const e of enrollments) {
      const stuRecords = records.filter(r => r.studentId === e.studentId);
      const presentCount = stuRecords.filter(r => r.present).length;
      const avg = sessionIds.length > 0 ? (presentCount / sessionIds.length) * 100 : null;
      attendanceMap[e.studentId] = avg;
    }
    const students = enrollments.map(e => ({ ...e.student, avgAttendance: attendanceMap[e.studentId] }));
    res.json({ students });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};