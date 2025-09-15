import { PrismaClient } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient();

export const teacherSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const bcrypt = (await import('bcrypt')).default;
    const valid = await bcrypt.compare(password, teacher.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jsonwebtoken.sign({ email: teacher.email, id: teacher.id }, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Sign in successful', token });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
