import express from "express";
import { AdminSignIn, AdminSingUp } from "../controllers/Admin/AdminAuthControllers.js";
import { adminAuth } from "../middlewares/AdminAuthMiddleware.js";
import { createClass, getClasses } from "../controllers/Admin/AdminClassControllers.js";
import { createSubject, getSubjectsByClass } from "../controllers/Admin/AdminSubjectControllers.js";
import { createTeacher, getTeachers, getTeacherById, updateTeacher } from "../controllers/Admin/AdminTeacherControllers.js";

const router=express.Router();

router.post("/signup",AdminSingUp);
router.post("/signin",AdminSignIn);
router.use(adminAuth);
router.post("/classes", createClass);
router.get("/classes", getClasses);
router.post("/subjects", createSubject);
router.get("/subjects/:classId", getSubjectsByClass);
router.post("/teachers", createTeacher);
router.get("/teachers", getTeachers);
router.get("/teachers/:teacherId", getTeacherById);
router.put("/teachers/:teacherId", updateTeacher);

export default router;