import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addDepartment,
  getDepartments,
  deleteDepartment,
  getDepartmentsWithEmployeeCount,
  getSubDepartments,
  getDepartmentById,
} from "../controllers/departmentControl.js";

const router = express.Router();

router.get("/with-count", authMiddleware, getDepartmentsWithEmployeeCount);
router.get("/", authMiddleware, getDepartments);
router.get("/:id", authMiddleware, getDepartmentById);
router.post("/add", authMiddleware, addDepartment);
router.get("/:id/subdepartments", authMiddleware, getSubDepartments);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
