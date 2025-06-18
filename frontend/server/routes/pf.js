import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import { createOrUpdatePf, getPfByUserId } from "../controllers/pfContoller.js";

const router = express.Router();

router.post("/", authMiddleware, createOrUpdatePf);
router.get("/:userId", authMiddleware, getPfByUserId);

export default router;
