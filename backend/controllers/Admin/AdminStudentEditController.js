import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollno, classId, subjectIds = [] } = req.body;
    // Update student basic info
    const student = await prisma.student.update({
      where: { id },
      data: { name, email, rollno },
    });
    // Remove old enrollments
    await prisma.enrollment.deleteMany({ where: { studentId: id } });
    // Add new enrollments for class/subjects
    let enrollments = [];
    if (classId && subjectIds.length > 0) {
      enrollments = await Promise.all(subjectIds.map(subjectId =>
        prisma.enrollment.create({
          data: {
            studentId: id,
            classId,
            subjectId
          }
        })
      ));
    } else if (classId) {
      enrollments.push(await prisma.enrollment.create({
        data: {
          studentId: id,
          classId
        }
      }));
    }
    return res.status(200).json({ student, enrollments });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
