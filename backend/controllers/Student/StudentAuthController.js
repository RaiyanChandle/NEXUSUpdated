import { PrismaClient } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient();

export const studentSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const bcrypt = (await import('bcrypt')).default;
    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jsonwebtoken.sign({ email: student.email, id: student.id }, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Sign in successful', token });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
