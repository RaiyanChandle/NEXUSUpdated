import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeacherSubjects = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    // Find all TeacherSubjectClass for this teacher
    const teacherSubjects = await prisma.teacherSubjectClass.findMany({
      where: { teacherId },
      include: {
        subject: true,
        class: true,
      },
    });
    // For each, count students enrolled in that subject/class
    const result = await Promise.all(
      teacherSubjects.map(async (tsc) => {
        const studentCount = await prisma.enrollment.count({
          where: { subjectId: tsc.subjectId, classId: tsc.classId },
        });
        return {
          subjectId: tsc.subject.id,
          subjectName: tsc.subject.name,
          classId: tsc.class.id,
          className: tsc.class.name,
          studentCount,
        };
      })
    );
    res.json({ subjects: result });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
