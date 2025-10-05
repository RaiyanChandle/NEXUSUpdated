import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createStudent = async (req, res) => {
  try {
    const { name, email, password, classId, subjectIds = [] } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Student with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let rollno = 1;
    if (classId) {
      // Count unique students already enrolled in this class (distinct studentId)
      const uniqueStudentIds = await prisma.enrollment.findMany({
        where: { classId },
        select: { studentId: true },
        distinct: ['studentId']
      });
      rollno = uniqueStudentIds.length + 1;
    }
    const student = await prisma.student.create({
      data: { name, email, password: hashedPassword, createdById: req.Adminid, rollno },
    });
    // create Enrollments for each subject if classId and subjectIds are provided
    let enrollments = [];
    if (classId && subjectIds.length >= 0) {
      enrollments = await Promise.all(subjectIds.map(subjectId =>
        prisma.enrollment.create({
          data: {
            studentId: student.id,
            classId,
            subjectId
          }
        })
      ));
    } else if (classId) {
      // If no subjects, create enrollment with only classId
      enrollments.push(await prisma.enrollment.create({
        data: {
          studentId: student.id,
          classId
        }
      }));
    }
    return res.status(201).json({ student, enrollments });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
      include: {
        enrollments: {
          include: {
            subject: true
          }
        }
      }
    });
    return res.status(200)    // Attach rollno to each student in the response (for compatibility if frontend expects it flat)
    const studentsWithRoll = students.map(s => ({ ...s, rollno: s.rollno }));
    res.json({ students: studentsWithRoll });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
