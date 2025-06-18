import express from "express";
import auth from "../middleware/authMiddlware.js";
import PrivateMessage from "../models/PrivateMessage.js";

const router = express.Router();

router.get("/:recipientId", auth, async (req, res) => {
  const messages = await PrivateMessage.find({
    $or: [
      { sender: req.user._id, recipient: req.params.recipientId },
      { sender: req.params.recipientId, recipient: req.user._id },
    ],
  }).populate("sender recipient", "name");
  res.json({ success: true, messages });
});

router.post("/", auth, async (req, res) => {
  const { recipient, message } = req.body;
  const msg = await PrivateMessage.create({
    sender: req.user._id,
    recipient,
    message,
  });
  res.json({ success: true, msg });
});
