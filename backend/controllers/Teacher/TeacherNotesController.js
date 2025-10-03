import cloudinary from '../../cloudinary.js';
import { PrismaClient } from '@prisma/client';
import streamifier from 'streamifier';

const prisma = new PrismaClient();

export const uploadNote = async (req, res) => {
  try {
    const { subjectId, topic } = req.body;
    const file = req.file;
    const teacherId = req.Teacherid;
    if (!file || !subjectId || !topic) return res.status(400).json({ message: 'PDF file, subject, and topic are required' });

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        format: 'pdf',
        folder: 'nexus-notes',
        public_id: `${teacherId}_${subjectId}_${topic.replace(/\s+/g, '_').toLowerCase()}`,
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });
        const note = await prisma.note.create({
          data: {
            teacherId,
            subjectId,
            topic,
            pdfUrl: result.secure_url,
          },
        });
        return res.status(201).json({ message: 'Note uploaded', note });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const getTeacherNotes = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const notes = await prisma.note.findMany({
      where: { teacherId },
      include: { subject: { select: { name: true, id: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ notes });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
