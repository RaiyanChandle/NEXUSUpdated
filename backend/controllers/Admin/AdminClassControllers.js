import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClass = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Class name is required" });
    const newClass = await prisma.class.create({
      data: {
        name,
        createdById: req.Adminid,
      },
    });
    return res.status(201).json({ message: "Class created", classObj: newClass });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: { createdById: req.Adminid },
      orderBy: { name: "asc" },
      include: {
        subjects: true
      }
    });
    return res.status(200).json({ classes });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
