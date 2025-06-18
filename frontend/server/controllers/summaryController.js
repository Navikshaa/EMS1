import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

const getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    res.status(200).json({ totalEmployees, totalDepartments });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

export default getSummary;
