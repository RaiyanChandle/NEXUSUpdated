import { googleClient, GOOGLE_CLIENT_ID } from '../../utils/googleOAuth.js';
import { PrismaClient } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient();

export const studentGoogleOAuth = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Missing Google OAuth code' });

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Get Google user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    // Find student
    let student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return res.status(401).json({ message: 'No student account for this email' });
    }
    // Issue JWT
    const token = jsonwebtoken.sign({ email, id: student.id }, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Sign in successful', token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Google OAuth failed', error: e.message });
  }
};
