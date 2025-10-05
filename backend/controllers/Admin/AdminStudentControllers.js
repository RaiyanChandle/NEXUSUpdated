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

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    // Delete submissions
    await prisma.submission.deleteMany({ where: { studentId } });
    // Delete attendance records
    await prisma.attendanceRecord.deleteMany({ where: { studentId } });
    // Delete enrollments
    await prisma.enrollment.deleteMany({ where: { studentId } });
    // Delete student
    await prisma.student.delete({ where: { id: studentId } });
    res.json({ success: true });
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
    const studentsWithRoll = students.map(s => ({ ...s, rollno: s.rollno }));
    res.json({ students: studentsWithRoll });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
