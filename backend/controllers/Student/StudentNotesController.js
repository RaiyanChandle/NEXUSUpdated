import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all notes for a subject (for students)
export const getNotesForSubject = async (req, res) => {
  try {
    const { subjectId } = req.query;
    if (!subjectId) return res.status(400).json({ message: 'Missing subjectId' });
    const notes = await prisma.note.findMany({
      where: { subjectId },
      include: {
        teacher: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ notes });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
