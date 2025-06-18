import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and is in correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Token missing or invalid",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB and exclude password
    const user = await User.findById(decoded._id).select("-password");

    // If user not found
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: User not found" });
    }

    // Attach user to request object for downstream access
    req.user = user;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    // Handle token expiration and invalid token errors specifically
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // Fallback for any other server errors
    return res
      .status(500)
      .json({ success: false, error: "Server error during authentication" });
  }
};

export default verifyUser;
