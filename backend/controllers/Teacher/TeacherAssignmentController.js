import { PrismaClient } from '@prisma/client';

// Get all submissions for a given assignment (teacher)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.query;
    if (!assignmentId) return res.status(400).json({ message: 'assignmentId required' });
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: { student: true }
    });
    res.json({ submissions });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
import cloudinary from '../../cloudinary.js';
import streamifier from 'streamifier';

const prisma = new PrismaClient();

// TEACHER: Create assignment (with optional PDF upload)
export const createAssignment = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const { subjectId, title, description, marks, deadline } = req.body;
    let pdfUrl = null;
    if (req.file) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            format: 'pdf',
            folder: 'nexus-assignments',
            public_id: title.replace(/\s+/g, '_').toLowerCase(),
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      pdfUrl = result.secure_url;
    }
    if (!subjectId || !title || !description || !marks || !deadline)
      return res.status(400).json({ message: 'All fields required' });
    const assignment = await prisma.assignment.create({
      data: {
        teacherId,
        subjectId,
        title,
        description,
        marks: parseInt(marks),
        deadline: new Date(deadline),
        pdfUrl,
      }
    });
    res.status(201).json({ assignment });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// TEACHER: List assignments for a subject
export const listAssignments = async (req, res) => {
  try {
    const teacherId = req.Teacherid;
    const { subjectId } = req.query;
    if (!subjectId) return res.status(400).json({ message: 'subjectId required' });
    const assignments = await prisma.assignment.findMany({
      where: { teacherId, subjectId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ assignments });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// STUDENT: List assignments for a subject (with submission status)
export const listStudentAssignments = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const { subjectId } = req.query;
    if (!subjectId) return res.status(400).json({ message: 'subjectId required' });
    const assignments = await prisma.assignment.findMany({
      where: { subjectId },
      orderBy: { createdAt: 'desc' },
      include: {
        submissions: { where: { studentId } }
      }
    });
    res.json({ assignments });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// STUDENT: Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const { assignmentId, fileUrl } = req.body;
    if (!assignmentId || !fileUrl)
      return res.status(400).json({ message: 'assignmentId and fileUrl required' });
    const now = new Date();
    // Upsert submission
    const submission = await prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      update: {
        fileUrl,
        status: 'SUBMITTED',
        submittedAt: now
      },
      create: {
        assignmentId,
        studentId,
        fileUrl,
        status: 'SUBMITTED',
        submittedAt: now
      }
    });
    res.json({ submission });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// TEACHER: Accept submission
export const acceptSubmission = async (req, res) => {
  try {
    const { submissionId, marksAwarded } = req.body;
    if (!submissionId)
      return res.status(400).json({ message: 'submissionId required' });
    const now = new Date();
    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: now,
        marksAwarded: marksAwarded !== undefined ? parseInt(marksAwarded) : undefined
      }
    });
    res.json({ submission });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
