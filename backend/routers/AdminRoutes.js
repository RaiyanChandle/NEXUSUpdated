import express from "express";
import { AdminSignIn, AdminSingUp } from "../controllers/Admin/AdminAuthControllers.js";
import { adminAuth } from "../middlewares/AdminAuthMiddleware.js";
import { createClass, getClasses } from "../controllers/Admin/AdminClassControllers.js";
import { createSubject, getSubjectsByClass } from "../controllers/Admin/AdminSubjectControllers.js";
import { createTeacher, getTeachers, getTeacherById, updateTeacher } from "../controllers/Admin/AdminTeacherControllers.js";
import upload from "../middlewares/upload.js";
import { uploadBook, getBooks } from "../controllers/Admin/LibraryController.js";
import { adminGoogleOAuth } from "../controllers/Admin/AdminGoogleOAuthController.js";

const router=express.Router();

router.post("/signup",AdminSingUp);
router.post("/signin",AdminSignIn);
router.post("/google-oauth", adminGoogleOAuth);
router.use(adminAuth);
router.post("/classes", createClass);
router.get("/classes", getClasses);
router.post("/subjects", createSubject);
router.get("/subjects/:classId", getSubjectsByClass);
router.post("/teachers", createTeacher);
router.get("/teachers", getTeachers);
router.get("/teachers/:teacherId", getTeacherById);
router.put("/teachers/:teacherId", updateTeacher);
router.post("/library/upload", upload.single('pdf'), uploadBook);
router.get("/library/books", getBooks);



export default router;