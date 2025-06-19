import express from "express";
import { addTarget, getAllTargets } from "../controllers/targetController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

// POST /api/targets
router.post("/", authMiddleware, addTarget);

// GET /api/targets
router.get("/", authMiddleware, getAllTargets);

export default router;
