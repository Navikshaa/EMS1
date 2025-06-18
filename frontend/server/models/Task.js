// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task_title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  subDepartment: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  initial_image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  update_start_date: {
    type: Date,
    default: Date.now,
  },
  update_end_date: {
    type: Date,
    default: Date.now,
  },
  query: {
    type: String,
    default: null,
  },
  reason: {
    type: String,
    default: null,
  },
  update: {
    type: String,
    default: null,
  },
  update_image: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "review", "completed", "delay"],
    default: "pending",
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
