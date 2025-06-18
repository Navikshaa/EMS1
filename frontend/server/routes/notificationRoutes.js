// routes/notificationRoutes.js
import express from "express";
import {
  getNotificationSettings,
  saveNotificationSettings,
} from "../controllers/notificationController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/notification-settings", verifyUser, getNotificationSettings);
router.post("/notification-settings", verifyUser, saveNotificationSettings);

export default router;
