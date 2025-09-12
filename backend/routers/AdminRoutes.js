import express from "express";
import { AdminSignIn, AdminSingUp } from "../controllers/Admin/AdminAuthControllers.js";
import { adminAuth } from "../middlewares/AdminAuthMiddleware.js";
import { createClass, getClasses } from "../controllers/Admin/AdminClassControllers.js";
import { createSubject, getSubjectsByClass } from "../controllers/Admin/AdminSubjectControllers.js";
import { createTeacher, getTeachers, getTeacherById, updateTeacher } from "../controllers/Admin/AdminTeacherControllers.js";
import { createStudent, getStudents } from "../controllers/Admin/AdminStudentControllers.js";
import { getDashboardCounts } from "../controllers/Admin/AdminDashboardController.js";
import upload from "../middlewares/upload.js";
import { uploadBook, getBooks } from "../controllers/Admin/LibraryController.js";
import { adminGoogleOAuth } from "../controllers/Admin/AdminGoogleOAuthController.js";
import { createAnnouncement, getAnnouncements } from "../controllers/Admin/AnnouncementController.js";

const router=express.Router();

router.post("/signup",AdminSingUp);
router.post("/signin",AdminSignIn);
router.post("/google-oauth", adminGoogleOAuth);
router.post("/announcements", adminAuth, createAnnouncement);
router.get("/announcements", adminAuth, getAnnouncements);
router.post("/classes",adminAuth, createClass);
router.get("/classes", adminAuth, getClasses);
router.post("/subjects", adminAuth, createSubject);
router.get("/subjects/:classId", adminAuth, getSubjectsByClass);
router.post("/teachers", adminAuth, createTeacher);
router.get("/teachers", adminAuth, getTeachers);
router.get("/teachers/:teacherId", adminAuth, getTeacherById);
router.put("/teachers/:teacherId", adminAuth, updateTeacher);
router.post("/library/upload",adminAuth, upload.single('pdf'),  uploadBook);
router.get("/library/books", adminAuth, getBooks);
router.post("/students", adminAuth, createStudent);
router.get("/students", adminAuth, getStudents);
router.get("/dashboard-counts", adminAuth, getDashboardCounts);

export default router;