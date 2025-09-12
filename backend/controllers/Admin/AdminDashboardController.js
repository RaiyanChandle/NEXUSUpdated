import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardCounts = async (req, res) => {
  try {
    const [students, teachers, subjects, classes] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.subject.count(),
      prisma.class.count(),
    ]);
    return res.status(200).json({ students, teachers, subjects, classes });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
