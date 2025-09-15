import cloudinary from '../../cloudinary.js';
import { PrismaClient } from '@prisma/client';
import streamifier from 'streamifier';

const prisma = new PrismaClient();

export const uploadBook = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    if (!file || !title) return res.status(400).json({ message: 'PDF file and title are required' });

    // Upload to Cloudinary using upload_stream
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        format: 'pdf',
        folder: 'nexus-library',
        public_id: title.replace(/\s+/g, '_').toLowerCase(),
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });
        // Save to DB
        const book = await prisma.library.create({
          data: {
            title,
            url: result.secure_url,
            uploadedById: req.Adminid,
          },
        });
        return res.status(201).json({ message: 'Book uploaded', book });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};



export const getBooks = async (req, res) => {
  try {
    const books = await prisma.library.findMany({
      where: { uploadedById: req.Adminid },
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { email: true, id: true } } }
    });
    return res.status(200).json({ books });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
