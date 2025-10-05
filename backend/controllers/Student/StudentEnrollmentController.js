import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /student/enrollments - return all enrollments for the logged-in student
export const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        subject: { select: { id: true, name: true } },
        class: { select: { id: true, name: true } }
      }
    });
    res.json({ enrollments });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
