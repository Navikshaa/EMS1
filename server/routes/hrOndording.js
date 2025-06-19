import express from "express";
import {
  getAllCandidates,
  addCandidate,
  updateCandidateStatus,
} from "../controllers/hrOnboarding.js";
import Candidate from "../models/HrOnboarding.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllCandidates);
router.post("/add", authMiddleware, addCandidate);
router.patch("/:id", authMiddleware, updateCandidateStatus);

// ✅ UPDATED /import ROUTE:
router.post("/import", async (req, res) => {
  try {
    let candidates = req.body;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: "No candidates provided" });
    }

    // ✅ Clean each candidate object
    candidates = candidates.map((c) => {
      const { _id, __v, onboardedAt, ...rest } = c;
      return rest;
    });

    await Candidate.insertMany(candidates);
    res.status(200).json({ message: "Imported successfully" });
  } catch (err) {
    console.error("Import Error:", err);
    res.status(500).json({ message: "Error importing candidates" });
  }
});

export default router;
