import express from "express";
import { teacherSignIn } from "../controllers/Teacher/TeacherAuthController.js";
import { teacherGoogleOAuth } from "../controllers/Teacher/TeacherGoogleOAuthController.js";
import { getTeacherCoursesAndClasses, getStudentsForCourseClass } from "../controllers/Teacher/TeacherStudentsController.js";
import { getTeacherSubjects } from "../controllers/Teacher/TeacherSubjectsController.js";
import { teacherAuth } from "../middlewares/TeacherAuthMiddleware.js";
import upload from "../middlewares/upload.js";
import { uploadNote, getTeacherNotes } from "../controllers/Teacher/TeacherNotesController.js";
import { createAssignment, listAssignments, acceptSubmission, getAssignmentSubmissions } from "../controllers/Teacher/TeacherAssignmentController.js";
import { createMeeting, listMeetings } from "../controllers/Teacher/TeacherMeetingController.js";
const router = express.Router();

router.post("/signin", teacherSignIn);
router.post("/google-oauth", teacherGoogleOAuth);
router.get("/subjects", teacherAuth, getTeacherSubjects);
router.get("/courses-classes", teacherAuth, getTeacherCoursesAndClasses);
router.get("/course-students", teacherAuth, getStudentsForCourseClass);

import {
  createAttendanceSession,
  getSessionsForCourse,
  getAttendanceForSession,
  markAttendance
} from "../controllers/Teacher/AttendanceSessionController.js";

router.post("/attendance-session", teacherAuth, createAttendanceSession);
router.get("/attendance-sessions", teacherAuth, getSessionsForCourse);
router.get("/attendance-records", teacherAuth, getAttendanceForSession);
router.post("/attendance-records", teacherAuth, markAttendance);

router.post("/notes/upload", teacherAuth, upload.single('pdf'), uploadNote);
router.get("/notes", teacherAuth, getTeacherNotes);
router.get("/assignment-submissions", teacherAuth, getAssignmentSubmissions);
router.post("/meetings", teacherAuth, createMeeting);
router.get("/meetings", teacherAuth, listMeetings);
import { getTeacherAnnouncements } from "../controllers/Teacher/TeacherAnnouncementsController.js";
import { getTeacherProfile, updateTeacherProfile } from "../controllers/Teacher/TeacherProfileController.js";
router.get("/announcements", teacherAuth, getTeacherAnnouncements);
router.get("/profile", teacherAuth, getTeacherProfile);
router.post("/profile", teacherAuth, updateTeacherProfile);

router.post("/assignments/upload", teacherAuth, upload.single('pdf'), createAssignment);
router.get("/assignments", teacherAuth, listAssignments);
router.post("/assignments/accept", teacherAuth, acceptSubmission);

export default router;
