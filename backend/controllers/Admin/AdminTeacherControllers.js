import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Teacher and assign subjects
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, subjectIds } = req.body;
    if (!name || !email || !password || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({ message: "All fields and at least one subject are required" });
    }
    // Hash teacher password
    const bcrypt = (await import('bcrypt')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create teacher
    const teacher = await prisma.teacher.create({
      data: { name, email, password: hashedPassword, createdById: req.Adminid },
    });
    // Assign subjects (for each subject, find its class)
    for (const subjectId of subjectIds) {
      const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
      if (subject) {
        await prisma.teacherSubjectClass.create({
          data: {
            teacherId: teacher.id,
            subjectId: subject.id,
            classId: subject.classId,
          },
        });
      }
    }
    return res.status(201).json({ message: "Teacher created", teacher });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all teachers for this admin (with assigned subjects)
export const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { createdById: req.Adminid },
      include: {
        subjectsTaught: {
          include: { subject: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return res.status(200).json({ teachers });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single teacher with details and subjects
export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        subjectsTaught: {
          include: { subject: true },
        },
      },
    });
    if (!teacher || teacher.createdById !== req.Adminid) {
      return res.status(404).json({ message: "Teacher not found or unauthorized" });
    }
    return res.status(200).json({ teacher });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update teacher details and subjects
export const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email, password, subjectIds } = req.body;
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.createdById !== req.Adminid) {
      return res.status(404).json({ message: "Teacher not found or unauthorized" });
    }
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { name, email, password },
    });
    // Remove existing subject assignments
    await prisma.teacherSubjectClass.deleteMany({ where: { teacherId } });
    // Add new subject assignments
    for (const subjectId of subjectIds) {
      const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
      if (subject) {
        await prisma.teacherSubjectClass.create({
          data: {
            teacherId,
            subjectId: subject.id,
            classId: subject.classId,
          },
        });
      }
    }
    return res.status(200).json({ message: "Teacher updated" });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
