import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.Studentid;
    // Count subjects (distinct subjects in enrollments)
    const subjectIds = (await prisma.enrollment.findMany({
      where: { studentId },
      select: { subjectId: true }
    })).map(e => e.subjectId).filter(Boolean);
    const subjectCount = new Set(subjectIds).size;
    // Count teachers (distinct teachers teaching enrolled subjects)
    const teacherIds = (await prisma.teacherSubjectClass.findMany({
      where: {
        subjectId: { in: subjectIds }
      },
      select: { teacherId: true }
    })).map(e => e.teacherId).filter(Boolean);
    const teacherCount = new Set(teacherIds).size;
    // Count assignments (for enrolled subjects)
    const assignmentCount = await prisma.assignment.count({
      where: {
        subjectId: { in: subjectIds }
      }
    });
    // Average attendance for the student
    let avgAttendance = 0;
    if (prisma.attendance && typeof prisma.attendance.findMany === 'function') {
      const attendances = await prisma.attendance.findMany({
        where: { studentId },
      });
      if (attendances.length > 0) {
        const presentCount = attendances.filter(a => a.present).length;
        avgAttendance = Math.round((presentCount / attendances.length) * 100);
      }
    }
    // If prisma.attendance is undefined, avgAttendance remains 0 without logging
    return res.status(200).json({ subjectCount, teacherCount, assignmentCount, avgAttendance });
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
