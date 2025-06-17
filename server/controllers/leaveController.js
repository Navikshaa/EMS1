import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import mongoose from "mongoose";

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

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(201).json({
      success: true,
      message: "Leave Added Successfully",
      leave: newLeave,
    });
  } catch (error) {
    console.error("Error in addLeave:", error); // Full error trace
    return res
      .status(500)
      .json({ success: false, error: "Leave add server error" });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee by userId
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

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name",
        },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(error.message); // log full error, not just .message
    return res
      .status(500)
      .json({ success: false, error: "Leave get server Error " });
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name, profileImage",
        },
      ],
    });
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error(error.message); // log full error, not just .message
    return res
      .status(500)
      .json({ success: false, error: "Leave get serverz Error " });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, startDate, endDate } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        startDate,
        endDate,
      },
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
    return res.status(500).json({
      success: false,
      error: "Leave update server error",
    });
  }
};

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
  addLeave,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
  getLeavesByUserId,
};
