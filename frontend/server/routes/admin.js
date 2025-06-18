import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { resetEmployeePasswordByEmail } from "../controllers/passwordController.js";


const router = express.Router();

router.post("/reset-password-by-email", authMiddleware, resetEmployeePasswordByEmail);

export default router;