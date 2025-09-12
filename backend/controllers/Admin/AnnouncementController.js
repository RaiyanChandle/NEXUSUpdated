import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, classId, teacherId } = req.body;
    if (!message || !type) return res.status(400).json({ message: 'Message and type are required' });
    // Only require classId or teacherId if type is CLASS or TEACHER
    if (type === 'CLASS' && !classId) return res.status(400).json({ message: 'classId required for CLASS announcement' });
    if (type === 'TEACHER' && (!teacherId || teacherId === '')) return res.status(400).json({ message: 'teacherId required for TEACHER announcement' });
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        type,
        classId: type === 'CLASS' ? classId : null,
        teacherId: type === 'TEACHER' ? (teacherId === 'ALL' ? null : teacherId) : null,
        createdById: req.Adminid,
      },
    });
    return res.status(201).json({ message: 'Announcement created', announcement });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { email: true, id: true } } },
    });
    return res.status(200).json({ announcements });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
