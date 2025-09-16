import express from "express";
import { studentSignIn } from "../controllers/Student/StudentAuthController.js";
import { studentGoogleOAuth } from "../controllers/Student/StudentGoogleOAuthController.js";

const router = express.Router();

router.post("/signin", studentSignIn);
router.post("/google-oauth", studentGoogleOAuth);

export default router;
