import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  sendDirectMessage,
  getDirectMessages,
  editDirectMessage,
  deleteDirectMessage,
  reactToMessage,
} from "../controllers/directMessageController.js";

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/messages"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", authMiddleware, upload.single("file"), sendDirectMessage); // Send
router.get("/:chatId", authMiddleware, getDirectMessages); // Get messages
router.put("/:messageId", authMiddleware, editDirectMessage); // ✏️ Edit message
router.delete("/:messageId", authMiddleware, deleteDirectMessage); // ❌ Delete message
router.post("/react/:messageId", authMiddleware, reactToMessage); // 😍 React to message

export default router;
