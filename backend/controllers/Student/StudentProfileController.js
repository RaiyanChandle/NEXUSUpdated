import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true }
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ student });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const updateStudentPassword = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });
    const hashed = await bcrypt.hash(password, 10);
    await prisma.student.update({
      where: { id: studentId },
      data: { password: hashed }
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
