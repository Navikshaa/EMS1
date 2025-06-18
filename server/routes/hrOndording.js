import express from "express";
import {
  getAllCandidates,
  addCandidate,
  updateCandidateStatus,
} from "../controllers/hrOnboarding.js";
import Candidate from "../models/HrOnboarding.js"; // ✅ ADD THIS LINE

const router = express.Router();

router.get("/", getAllCandidates);
router.post("/add", addCandidate);
router.patch("/:id", updateCandidateStatus);


export default router;
