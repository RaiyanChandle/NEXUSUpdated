import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get admin announcements for student: GLOBAL and CLASS for student's classes
export const getStudentAnnouncements = async (req, res) => {
  try {
    const studentId = req.Studentid;
    // Get all classIds for this student
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      select: { classId: true }
    });
    const classIds = enrollments.map(e => e.classId);
    // Get announcements
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { type: 'GLOBAL' },
          { type: 'CLASS', classId: { in: classIds } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { email: true, id: true } } }
    });
    res.json({ announcements });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
