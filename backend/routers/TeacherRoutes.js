import express from "express";
import { teacherSignIn } from "../controllers/Teacher/TeacherAuthController.js";
import { teacherGoogleOAuth } from "../controllers/Teacher/TeacherGoogleOAuthController.js";

const router = express.Router();

router.post("/signin", teacherSignIn);
router.post("/google-oauth", teacherGoogleOAuth);

export default router;
