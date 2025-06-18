import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  upload,
  addLeave,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
  getLeavesByUserId,
} from "../controllers/leaveController.js";

const router = express.Router();
router.post("/add", upload.single("medicalProof"), addLeave);
router.get("/:id", authMiddleware, getLeave);
router.get("/detail/:id", authMiddleware, getLeaveDetail);
router.get("/", authMiddleware, getLeaves);
router.put("/:id", authMiddleware, updateLeave);
router.get("/user/:userId", getLeavesByUserId);

export default router;
