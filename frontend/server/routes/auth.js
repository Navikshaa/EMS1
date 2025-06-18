import express from "express";
import { login, logout, verify } from "../controllers/authController.js";
import { setNewPassword } from "../controllers/passwordController.js"; 
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/verify", authMiddleware, verify);
router.post("/set-password", authMiddleware, setNewPassword);

export default router;

