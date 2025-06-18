import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addGroupMessage,
  getGroupMessages,
  updateGroupMessage,
  deleteGroupMessage,
  reactToMessage,
  forwardMessage,
} from "../controllers/groupMessageController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/messages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", authMiddleware, upload.single("file"), addGroupMessage);
router.get("/:groupId", authMiddleware, getGroupMessages);
router.put("/:id", authMiddleware, updateGroupMessage);
router.delete("/:id", authMiddleware, deleteGroupMessage);
router.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: "No file uploaded" });

  res.status(200).json({
    success: true,
    url: `/uploads/messages/${req.file.filename}`,
  });
});
router.post("/react/:msgId", authMiddleware, reactToMessage);
router.post("/forward", authMiddleware, forwardMessage);

export default router;
