import express from "express";
import { teacherSignIn } from "../controllers/Teacher/TeacherAuthController.js";

const router = express.Router();

router.post("/signin", teacherSignIn);

export default router;
