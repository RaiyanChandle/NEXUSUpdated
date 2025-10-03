import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeacherAnnouncements = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { type: 'GLOBAL' },
          { type: 'TEACHER', teacherId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { email: true, id: true } } },
    });
    return res.status(200).json({ announcements });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
