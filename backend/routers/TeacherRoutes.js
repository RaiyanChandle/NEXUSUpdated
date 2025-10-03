import express from "express";
import { teacherSignIn } from "../controllers/Teacher/TeacherAuthController.js";
import { teacherGoogleOAuth } from "../controllers/Teacher/TeacherGoogleOAuthController.js";
import { getTeacherCoursesAndClasses, getStudentsForCourseClass } from "../controllers/Teacher/TeacherStudentsController.js";
import { getTeacherSubjects } from "../controllers/Teacher/TeacherSubjectsController.js";
import { teacherAuth } from "../middlewares/TeacherAuthMiddleware.js";
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

export default router;
