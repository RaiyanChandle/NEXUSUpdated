import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardCounts = async (req, res) => {
  try {
    const adminId = req.Adminid;
    const classesCount = await prisma.class.count({ where: { createdById: adminId } });
    const teachersCount = await prisma.teacher.count({ where: { createdById: adminId } });
    const studentsCount = await prisma.student.count({ where: { createdById: adminId } });
    const booksCount = await prisma.library.count({ where: { uploadedById: adminId } });
    const announcementsCount = await prisma.announcement.count({ where: { createdById: adminId } });
    return res.json({
      classesCount,
      teachersCount,
      studentsCount,
      booksCount,
      announcementsCount,
    });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
