import express from "express";
import { AdminSignIn, AdminSingUp } from "../controllers/Admin/AdminAuthControllers.js";
import { adminAuth } from "../middlewares/AdminAuthMiddleware.js";
import { createClass, getClasses } from "../controllers/Admin/AdminClassControllers.js";
import { createSubject, getSubjectsByClass } from "../controllers/Admin/AdminSubjectControllers.js";

const router=express.Router();

router.post("/signup",AdminSingUp);
router.post("/signin",AdminSignIn);
router.use(adminAuth);
router.post("/classes", createClass);
router.get("/classes", getClasses);
router.post("/subjects", createSubject);
router.get("/subjects/:classId", getSubjectsByClass);

export default router;