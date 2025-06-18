import express from "express";
import {
  getLoginHistoryByUserId,
  getLoginHistoryByDepartmentId,
  createOrUpdateLoginHistory,
  editLoginHistoryByUserId,
  getAllLoginHistoryUsers,
} from "../controllers/loginHistoryController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.get("/",  authMiddleware, getAllLoginHistoryUsers);
// GET /api/login-history/:employeeId
router.get("/:userId", authMiddleware,getLoginHistoryByUserId);

router.get("/department/:depId",authMiddleware ,getLoginHistoryByDepartmentId);

router.post("/", authMiddleware, createOrUpdateLoginHistory);

router.put("/edit/:userId",authMiddleware, editLoginHistoryByUserId);

export default router;
