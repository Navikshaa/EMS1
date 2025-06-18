import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Employee from "../models/Employee.js"; // ✅ Import Employee model
import LoginHistory from "../models/LoginHistory.js";

const TIMEZONE = "Asia/Kolkata";

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }

    // 3. Check employee status if role is 'employee'
    if (user.role === "employee") {
      const employee = await Employee.findOne({ userId: user._id });

      if (!employee) {
        return res.status(403).json({
          success: false,
          error: "Access Denied: No employee record found",
        });
      }

      if (employee.status === "inactive" || employee.status === "terminated") {
        return res.status(403).json({
          success: false,
          error: `Access Denied: Your account is ${employee.status}`,
        });
      }
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // 5. Check if already logged in today
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await LoginHistory.findOne({
      userId: user._id,
      loginAt: { $gte: todayStart, $lte: todayEnd },
    });

    // 6. Create login history if not already created today
    if (!existing) {
      await LoginHistory.create({
        userId: user._id,
        loginAt: new Date().toLocaleString("en-US", { timeZone: TIMEZONE }),
      });
    }

    // 7. Send response
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        firstLogin: user.firstLogin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const loginRecord = await LoginHistory.findOne({
      userId,
      loginAt: { $gte: todayStart, $lte: todayEnd },
    }).sort({ loginAt: -1 });

    if (!loginRecord) {
      return res.status(400).json({
        success: false,
        error: "No active session found for today",
      });
    }

    loginRecord.logoutAt = new Date().toLocaleString("en-US", {
      timeZone: TIMEZONE,
    });
    await loginRecord.save();

    res.status(200).json({ success: true, message: "Logout time recorded" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Verify Controller
const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, logout, verify };
