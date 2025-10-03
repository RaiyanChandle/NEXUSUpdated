import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { id: true, name: true, email: true }
    });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ teacher });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const updateTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const { name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const updated = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData,
      select: { id: true, name: true, email: true }
    });
    res.json({ teacher: updated });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
