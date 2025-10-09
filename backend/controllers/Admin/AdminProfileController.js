import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.Adminid },
      select: { id: true, email: true }
    });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ admin });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = {};
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.update({
      where: { id: req.Adminid },
      data
    });
    res.json({ admin });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
