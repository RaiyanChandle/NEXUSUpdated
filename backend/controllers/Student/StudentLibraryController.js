import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Public: Get all books, search by title
export const getBooksForStudent = async (req, res) => {
  try {
    const { q } = req.query;
    const books = await prisma.library.findMany({
      where: q ? { title: { contains: q, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { email: true, id: true } } }
    });
    return res.status(200).json({ books });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
