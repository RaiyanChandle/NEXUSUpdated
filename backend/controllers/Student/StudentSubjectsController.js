import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all subjects a student is registered to, with teacher info
export const getStudentSubjects = async (req, res) => {
  try {
    const studentId = req.Studentid;
    // Find all enrollments for this student, include subject and teacher
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        subject: {
          include: {
            teachers: {
              include: {
                teacher: true
              }
            }
          }
        }
      }
    });
    // Map to subject info + teacher
    const result = enrollments.map(e => {
      const subject = e.subject;
      // Just show the first teacher for this subject
      const teacher = subject.teachers[0]?.teacher;
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        teacher: teacher ? { id: teacher.id, name: teacher.name, email: teacher.email } : null
      };
    });
    res.json({ subjects: result });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
