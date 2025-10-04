import express from "express";
import { studentSignIn } from "../controllers/Student/StudentAuthController.js";
import { studentGoogleOAuth } from "../controllers/Student/StudentGoogleOAuthController.js";
import { studentAuth } from "../middlewares/StudentAuthMiddleware.js";

import { getStudentSubjects } from "../controllers/Student/StudentSubjectsController.js";
import { getNotesForSubject } from "../controllers/Student/StudentNotesController.js";
import { getStudentAttendanceForSubject, getStudentAttendanceAverage } from "../controllers/Student/StudentAttendanceController.js";
import { getStudentAnnouncements } from "../controllers/Student/StudentAnnouncementsController.js";
import { getBooksForStudent } from "../controllers/Student/StudentLibraryController.js";
import { getStudentProfile, updateStudentPassword } from "../controllers/Student/StudentProfileController.js";
const router = express.Router();

router.post("/signin", studentSignIn);
router.post("/google-oauth", studentGoogleOAuth);

router.get("/subjects", studentAuth, getStudentSubjects);

router.get("/notes", studentAuth, getNotesForSubject);

router.get("/attendance-records", studentAuth, getStudentAttendanceForSubject);
router.get("/attendance-average", studentAuth, getStudentAttendanceAverage);

router.get("/announcements", studentAuth, getStudentAnnouncements);

router.get("/library/books", getBooksForStudent);

router.get("/profile", studentAuth, getStudentProfile);
router.post("/profile/password", studentAuth, updateStudentPassword);

export default router;
