import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      grossPay,
      basicSalary,
      overtimeHours = 0,
      lopDays = 0,
      lateLogins = 0,
      halfDays = 0,
      targetAllowance = 0,
      overtimeAllowance = 0,
      targetPenalty = 0,
      loan = 0,
      pt = 0,
      bonus = 0,
      payDate,
      payFrom,
      payTo,
    } = req.body;

    // Validate required fields
    if (!employeeId || !grossPay || !basicSalary || !payDate) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: employeeId, grossPay, basicSalary, payDate",
      });
    }

    const gross = parseFloat(grossPay);
    const basic = parseFloat(basicSalary);
    const perDay = gross / 30;

    // Allowances calculation
    const allowances = {
      houseRent: gross * 0.09,
      medical: gross * 0.042,
      travel: gross * 0.068,
      food: gross * 0.1,
      overTime: parseFloat(overtimeHours) * 200,
      overtimeAllowance: parseFloat(overtimeAllowance),
      target: parseFloat(targetAllowance),
      bonus: parseFloat(bonus),
    };

    const totalAllowances = Object.values(allowances).reduce(
      (sum, val) => sum + val,
      0
    );

    // Deductions calculation
    const deductions = {
      leaveOfAbsence: perDay * parseFloat(lopDays),
      lateLogin: parseFloat(lateLogins) * 300,
      halfDay: (perDay / 2) * parseFloat(halfDays),
      pf: basic * 0.1,
      targetPenalty: parseFloat(targetPenalty),
      loan: parseFloat(loan),
      pt: parseFloat(pt),
    };

    const totalDeductions = Object.values(deductions).reduce(
      (sum, val) => sum + val,
      0
    );

    // Final net salary
    const netSalary = basic + totalAllowances - totalDeductions;

    const newSalary = new Salary({
      employeeId,
      basicSalary: basic,
      allowances,
      deductions,
      netSalary,
      overtimeHours,
      lopDays,
      lateLogins,
      halfDays,
      bonus,
      targetAllowance,
      targetPenalty,
      loan,
      payDate,
      payFrom,
      payTo,
    });

    await newSalary.save();

    return res.status(200).json({ success: true, salary: newSalary });
  } catch (error) {
    console.error("Salary add error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while adding salary" });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;


    // Try finding salary records by employeeId directly
    let salary = await Salary.find({ employeeId: id }).populate("employeeId");

    // If none found, try to find employee by userId and then get salary
    if (!salary || salary.length < 1) {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res
          .status(404)
          .json({ success: false, error: "Employee not found" });
      }
      salary = await Salary.find({ employeeId: employee._id }).populate(
        "employeeId"
      );

    }

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error("Salary get error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Salary get server error" });
  }
};

const getDepartmentWiseSalary = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month); // optional

    let matchStage = {};

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      matchStage = {

        payDate: { $gte: startDate, $lte: endDate }


      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      matchStage = {

        payDate: { $gte: startDate, $lte: endDate }
        
      };
    }

    const result = await Salary.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $lookup: {
          from: "departments",
          localField: "employee.department",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: "$department" },
      {
        $group: {
          _id: "$department.dep_name",
          totalSalary: { $sum: "$netSalary" },
          avgSalary: { $avg: "$netSalary" },
          employeeCount: { $sum: 1 },
        },
      },
      {
        $project: {
          department: "$_id",
          totalSalary: 1,
          avgSalary: 1,
          employeeCount: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in department-wise salary aggregation:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error while aggregating salary" });
  }
};

export { addSalary, getSalary, getDepartmentWiseSalary };
