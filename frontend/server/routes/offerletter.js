import express from "express";
import { getOfferLetter } from "../controllers/offerLetterController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.get("/generate/:id", authMiddleware, getOfferLetter);

export default router;
