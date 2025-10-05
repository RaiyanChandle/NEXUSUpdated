import { PrismaClient } from '@prisma/client';
import cloudinary from '../../cloudinary.js';
import streamifier from 'streamifier';

const prisma = new PrismaClient();

// Student: List assignments for subject (with submission status)
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

// Student: Delete their own submission for an assignment
export const deleteSubmission = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const { assignmentId } = req.body;
    if (!assignmentId) return res.status(400).json({ message: 'assignmentId required' });
    const submission = await prisma.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } }
    });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    await prisma.submission.delete({
      where: { assignmentId_studentId: { assignmentId, studentId } }
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};

// Student: Submit assignment


export const submitAssignment = async (req, res) => {
  try {
    const studentId = req.Studentid;
    const { assignmentId } = req.body;
    if (!assignmentId || !req.file)
      return res.status(400).json({ message: 'assignmentId and PDF file required' });
    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          format: 'pdf',
          folder: 'nexus-assignment-submissions',
          public_id: `${assignmentId}_${studentId}_${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    const fileUrl = result.secure_url;
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
    console.error(e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};
