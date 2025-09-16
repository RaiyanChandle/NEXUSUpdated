import express from "express";
import { studentSignIn } from "../controllers/Student/StudentAuthController.js";

const router = express.Router();

router.post("/signin", studentSignIn);

export default router;
