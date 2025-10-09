import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardCounts = async (req, res) => {
  try {
    const adminId = req.Adminid;
    const [students, teachers, subjects, classes, announcements, books] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.subject.count(),
      prisma.class.count(),
      prisma.announcement.count(),
      prisma.library.count(),
    ]);
    return res.status(200).json({ students, teachers, subjects, classes, announcements, books });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
