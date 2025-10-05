import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Teacher creates a meeting
export const createMeeting = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const { subjectId, classId, date, time } = req.body;
    if (!subjectId || !classId || !date || !time) {
      return res.status(400).json({ message: 'All fields required' });
    }
    // Generate room name (unique, human-friendly)
    const roomName = `nexus_${classId}_${subjectId}_${Date.now()}`;
    const startTime = new Date(`${date}T${time}`);
    const meeting = await prisma.meeting.create({
      data: {
        roomName,
        subjectId,
        classId,
        teacherId,
        startTime
      }
    });
    res.status(201).json({ meeting });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// Teacher or student: list meetings for a class/subject
export const listMeetings = async (req, res) => {
  try {
    const { subjectId, classId } = req.query;
    if (!subjectId || !classId) {
      return res.status(400).json({ message: 'subjectId and classId required' });
    }
    const meetings = await prisma.meeting.findMany({
      where: { subjectId, classId },
      orderBy: { startTime: 'desc' },
      include: {
        teacher: { select: { name: true, email: true } },
        subject: { select: { name: true } },
        class: { select: { name: true } }
      }
    });
    res.json({ meetings });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
