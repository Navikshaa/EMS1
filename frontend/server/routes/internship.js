// routes/internshipCertificate.js
import express from "express";
import getInternshipCertificate from "../controllers/internshipController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.get("/generate/:id", authMiddleware, getInternshipCertificate);

export default router;
