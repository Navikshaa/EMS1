import Task from "../models/Task.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create a task
const createTask = async (req, res) => {
  try {
    const {
      task_title,
      subDepartment,
      employeeName,
      message,
      startDate,
      endDate,
      query,
      reason,
      update,
      status,
    } = req.body;

    const assignedBy = req.user._id;

    const taskData = {
      task_title,
      subDepartment,
      employeeName,
      message,
      assignedBy,
      startDate: startDate || Date.now(),
      endDate: endDate || Date.now(),
      query: query || null,
      reason: reason || null,
      update: update || null,
      status: status || "pending",
    };

    if (req.file) {
      taskData.initial_image = req.file.filename;
    }

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ success: false, error: "Failed to create task" });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedBy", "name");
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      task_title,
      subDepartment,
      employeeName,
      message,
      status,
      query,
      reason,
      update,
      startDate,
      endDate,
      update_start_date,
      update_end_date,
    } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Update fields if provided
    task.task_title = task_title || task.task_title;
    task.subDepartment = subDepartment || task.subDepartment;
    task.employeeName = employeeName || task.employeeName;
    task.message = message || task.message;
    task.status = status || task.status;
    task.query = query ?? task.query;
    task.reason = reason ?? task.reason;
    task.update = update ?? task.update;
    task.startDate = startDate || task.startDate;
    task.endDate = endDate || task.endDate;
    task.update_start_date = update_start_date || task.update_start_date;
    task.update_end_date = update_end_date || task.update_end_date;

    // If Multer stored an "update_image", delete old and assign new filename
    if (req.file) {
      if (task.update_image) {
        const oldUpdateImgPath = path.join("public/uploads", task.update_image);
        if (fs.existsSync(oldUpdateImgPath)) {
          fs.unlinkSync(oldUpdateImgPath);
        }
      }
      task.update_image = req.file.filename;
    }

    await task.save();
    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Delete initial_image if it exists
    if (task.initial_image) {
      const imgPath = path.join("public/uploads", task.initial_image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }
    // Delete update_image if it exists
    if (task.update_image) {
      const updateImgPath = path.join("public/uploads", task.update_image);
      if (fs.existsSync(updateImgPath)) {
        fs.unlinkSync(updateImgPath);
      }
    }

    await task.remove();
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ success: false, error: "Failed to delete task" });
  }
};

// Get tasks by employeeName
const getTaskByEmployeeName = async (req, res) => {
  try {
    const { employeeName } = req.params;

    const tasks = await Task.find({ employeeName }).populate(
      "assignedBy",
      "name"
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this employee",
      });
    }

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("Error fetching tasks by employee name:", err);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
};

export {
  upload,
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskByEmployeeName,
};
