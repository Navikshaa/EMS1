import Target from "../models/Target.js";

// Add a new target
const addTarget = async (req, res) => {
  try {
    const { subDepartment, employeeName, targetNumber, total_points } =
      req.body;

    if (!subDepartment || !employeeName || !targetNumber) {
      return res.status(400).json({
        message: "subDepartment, employeeName, and targetNumber are required",
      });
    }

    const newTarget = new Target({
      subDepartment,
      employeeName,
      targetNumber,
      total_points, // will be undefined if not sent, mongoose default applies
    });

    const savedTarget = await newTarget.save();
    res.status(201).json(savedTarget);
  } catch (error) {
    console.error("Error adding target:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all targets
const getAllTargets = async (req, res) => {
  try {
    const targets = await Target.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(targets);
  } catch (error) {
    console.error("Error fetching targets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllTargets, addTarget };
