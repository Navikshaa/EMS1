import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addSalary,
  getSalary,
  getDepartmentWiseSalary,
} from "../controllers/salaryController.js";

const router = express.Router();

router.post("/add", authMiddleware, addSalary);
router.get("/department-salary", authMiddleware, getDepartmentWiseSalary);
router.get("/:id", authMiddleware, getSalary);

// router.get("/download/:id", downloadSalarySlip);

export default router;
