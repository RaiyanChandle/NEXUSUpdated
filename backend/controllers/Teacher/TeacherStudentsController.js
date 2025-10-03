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
