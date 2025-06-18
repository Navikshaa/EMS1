import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().select(
      "dep_name description sub_departments"
    );
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description, sub_departments } = req.body;

    const existingDep = await Department.findOne({ dep_name });

    if (existingDep) {
      // Append new sub_departments if they don't already exist
      const existingSubs = existingDep.sub_departments || [];
      const newSubs = Array.isArray(sub_departments)
        ? sub_departments
        : [sub_departments];
      const updatedSubs = [...new Set([...existingSubs, ...newSubs])]; // Ensure uniqueness

      existingDep.sub_departments = updatedSubs;
      existingDep.updatedAt = Date.now();
      await existingDep.save();

      return res.status(200).json({
        success: true,
        message: "Sub-departments updated successfully",
        department: existingDep,
      });
    }

    // Create new department
    const newDep = new Department({
      dep_name,
      description,
      sub_departments: Array.isArray(sub_departments)
        ? sub_departments
        : [sub_departments],
    });

    await newDep.save();

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: newDep,
    });
  } catch (error) {
    console.error("Error adding/updating department:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDep = await Department.findByIdAndDelete(id);
    if (!deletedDep) {
      return res
        .status(404)
        .json({ success: false, error: "Department not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getDepartmentsWithEmployeeCount = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: "employees", // MongoDB collection name
          localField: "_id",
          foreignField: "department",
          as: "employees",
        },
      },
      {
        $project: {
          dep_name: 1,
          employeeCount: { $size: "$employees" },
        },
      },
    ]);

    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error fetching departments with employee count",
    });
  }
};

const getSubDepartments = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id).select("sub_departments");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ subDepartments: department.sub_departments });
  } catch (error) {
    console.error("Error fetching sub-departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Department ID" });
    }

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ department });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addDepartment,
  getDepartments,
  deleteDepartment,
  getDepartmentsWithEmployeeCount,
  getSubDepartments,
  getDepartmentById,
};
