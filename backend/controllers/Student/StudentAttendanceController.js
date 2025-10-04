import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get attendance records for a student in a subject
export const getStudentAttendanceForSubject = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const { subjectId } = req.query;
    if (!subjectId) return res.status(400).json({ message: 'Missing subjectId' });
    // Find all attendance records for this subject and student
    const records = await prisma.attendanceRecord.findMany({
      where: {
        studentId,
        session: { subjectId }
      },
      include: { session: true },
      orderBy: { session: { date: 'asc' } }
    });
    res.json({ records });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// Get total average attendance for a student across all subjects
export const getStudentAttendanceAverage = async (req, res) => {
  try {
    const studentId = req.Studentid;
    // Get all attendance records for this student
    const records = await prisma.attendanceRecord.findMany({
      where: { studentId }
    });
    const total = records.length;
    const present = records.filter(r => r.present).length;
    const average = total === 0 ? 0 : Math.round((present / total) * 100);
    res.json({ average, total, present });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
