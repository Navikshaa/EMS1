import bcrypt from "bcrypt";
import User from "../models/User.js";

 const setNewPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ success: false, error: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword,
      firstLogin: false, // ✅ Mark first login as completed
    });

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Set password error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};



 const resetEmployeePasswordByEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied" });
  }

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.firstLogin = true; // Force to set password on next login
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export { setNewPassword, resetEmployeePasswordByEmail };