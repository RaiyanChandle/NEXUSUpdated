import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    // Count courses (teacherSubjectClass)
    const courses = await prisma.teacherSubjectClass.findMany({ where: { teacherId } });
    const courseCount = courses.length;
    // Count unique classes
    const classIds = new Set(courses.map(c => c.classId));
    const classCount = classIds.size;
    // Count unique students enrolled in those classes
    const students = await prisma.enrollment.findMany({
      where: { classId: { in: Array.from(classIds) } },
      select: { studentId: true }
    });
    const studentCount = new Set(students.map(e => e.studentId)).size;
    res.json({ courseCount, classCount, studentCount });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
