import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { resetEmployeePasswordByEmail } from "../controllers/passwordController.js";
import { changePassword } from '../controllers/settingController.js';


const router = express.Router();

router.put('/change-password', authMiddleware, changePassword );
router.post("/reset-password-by-email", authMiddleware, resetEmployeePasswordByEmail);

export default router;