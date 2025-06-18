import express from "express";
import {
  upload,
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskByEmployeeName,
} from "../controllers/taskController.js";
import verifyUser from "../middleware/authMiddlware.js";

const router = express.Router();

// Create a task
router.post("/assign", verifyUser, upload.single("initial_image"), createTask);

// Get all tasks
router.get("/", verifyUser, getAllTasks);

// Update a task
router.put("/:id", upload.single("update_image"), updateTask);

// Delete a task
router.delete("/:id", verifyUser, deleteTask);

router.get("/employee/:employeeName", verifyUser, getTaskByEmployeeName);

export default router;
