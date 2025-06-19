import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import multer from "multer";

import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

// ✅ Multer Setup Inside Controller
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// ✅ Add Leave with Optional Medical Proof Upload
const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    let medicalProofPath = null;
    if (leaveType === "Medical Leave" && req.file) {
      medicalProofPath = req.file.path;
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
      medicalProof: medicalProofPath,
    });

    await newLeave.save();

    return res.status(201).json({
      success: true,
      message: "Leave Added Successfully",
      leave: newLeave,
    });
  } catch (error) {
    console.error("Error in addLeave:", error);
    return res
      .status(500)
      .json({ success: false, error: "Leave add server error" });
  }
};

// ✅ Get All Leaves for One User
const getLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ userId: id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const leaves = await Leave.find({ employeeId: employee._id });
    return res.status(200).json({ success: true, leaves: leaves || [] });
  } catch (error) {
    console.error("getLeave error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Leave get server Error" });
  }
};

// ✅ Get All Leaves (Admin)
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name" },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(error); // log full error
    return res
      .status(500)
      .json({ success: false, error: "Leave get server Error" });
  }
};

// ✅ Get One Leave in Detail
const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id).populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name profileImage" },
      ],
    });
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("getLeaveDetail error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Leave get server Error" });
  }
};

// ✅ Update Leave
const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, startDate, endDate } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status, startDate, endDate },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      leave,
    });
  } catch (error) {
    console.error("Update Leave Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Leave update server error" });
  }
};

// ✅ Get Leaves by User ID (Summary)
const getLeavesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const leaves = await Leave.find({ employeeId: employee._id });

    const filteredLeaves = leaves.map((leave) => ({
      _id: leave._id,
      status: leave.status,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
    }));

    return res.status(200).json({ success: true, leaves: filteredLeaves });
  } catch (error) {
    console.error("getLeavesByUserId error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching leaves by userId",
    });
  }
};

export {
  upload,
  addLeave,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
  getLeavesByUserId,
};
