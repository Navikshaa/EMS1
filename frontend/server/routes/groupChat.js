import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  getMyGroups,
  addGroupMembers,
} from "../controllers/groupChatController.js";

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/groups");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_group" + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create group
router.post("/add", authMiddleware, upload.single("group_dp"), createGroup);

// Get all groups
router.get("/", authMiddleware, getAllGroups);
router.get("/my-groups", authMiddleware, getMyGroups);

router.put("/:id/add-members", authMiddleware, addGroupMembers);


// Get single group
router.get("/:id", authMiddleware, getGroupById);

export default router;
