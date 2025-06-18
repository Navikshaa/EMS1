import express from "express";
import verifyUser from "../middleware/authMiddlware.js";
import getSummary from "../controllers/summaryController.js";

const router = express.Router();

router.get("/", verifyUser, getSummary);

export default router;
