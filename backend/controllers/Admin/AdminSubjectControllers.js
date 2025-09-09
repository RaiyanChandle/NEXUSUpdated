import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSubject = async (req, res) => {
  try {
    const { name, classId } = req.body;
    if (!name || !classId) return res.status(400).json({ message: "Subject name and classId are required" });
    // Check if class exists and belongs to admin
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, createdById: req.Adminid },
    });
    if (!targetClass) return res.status(404).json({ message: "Class not found or unauthorized" });
    const subject = await prisma.subject.create({
      data: { name, classId },
    });
    return res.status(201).json({ message: "Subject created", subject });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    // Check if class exists and belongs to admin
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, createdById: req.Adminid },
    });
    if (!targetClass) return res.status(404).json({ message: "Class not found or unauthorized" });
    const subjects = await prisma.subject.findMany({
      where: { classId },
      orderBy: { name: "asc" },
    });
    return res.status(200).json({ subjects });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
