import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  createOrGetChat,
  getAllChats,
  getChatById,
} from "../controllers/directChatController.js";

const router = express.Router();

router.post("/", authMiddleware, createOrGetChat);
router.get("/", authMiddleware, getAllChats);
router.get("/:id", authMiddleware, getChatById);

export default router;
