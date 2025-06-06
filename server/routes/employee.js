import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  fetchEmployeesByUserId,
  getDepartmentByUserId,
  fetchUsersGroupedByRoleInDepartment,
  fetchUsersGroupedByDesignationInDepartment,
  fetchEmployeesByDesignationName,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", getEmployees);

router.post("/add", authMiddleware, upload.single("image"), addEmployee);

// :id route
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);

router.get("/user/:userId", fetchEmployeesByUserId);

router.get("/:id", authMiddleware, getEmployee);

router.put("/:id", authMiddleware, updateEmployee);

// Route to get department by User ID
router.get("/get-department/:userId", getDepartmentByUserId);

router.get(
  "/users/roles/department/:departmentId",
  fetchUsersGroupedByRoleInDepartment
);

router.get(
  "/users/designations/:departmentId",
  fetchUsersGroupedByDesignationInDepartment
);

router.get("/designation-name/:name", fetchEmployeesByDesignationName);

export default router;
