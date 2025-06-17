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

router.get("/", getAllLoginHistoryUsers);
// GET /api/login-history/:employeeId
router.get("/:userId", getLoginHistoryByUserId);

router.get("/department/:depId", getLoginHistoryByDepartmentId);

router.post("/", createOrUpdateLoginHistory);

router.put("/edit/:userId", editLoginHistoryByUserId);

export default router;
