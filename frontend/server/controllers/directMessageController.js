// controllers/directMessageController.js

import DirectMessage from "../models/DirectMessage.js";
import DirectChat from "../models/DirectChat.js";

// Send a direct message
export const sendDirectMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const file = req.file ? req.file.path : null;

    const msg = new DirectMessage({
      chatId,
      sender: req.user._id,
      message,
      file,
      isDelivered: false,
      isRead: false,
    });

    await msg.save();
    await msg.populate("sender", "name profileImage");

    // Update chat timestamp
    await DirectChat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

// Get all messages of a chat
export const getDirectMessages = async (req, res) => {
  try {
    const messages = await DirectMessage.find({ chatId: req.params.chatId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    await DirectMessage.updateMany(
      {
        chatId: req.params.chatId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { isRead: true, isDelivered: true }
    );

    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

// Edit a message
export const editDirectMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    const msg = await DirectMessage.findById(messageId);
    if (!msg) return res.status(404).json({ success: false, error: "Message not found" });

    if (msg.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    msg.message = message;
    msg.editedAt = new Date();
    await msg.save();

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to edit message" });
  }
};

// Delete a message
export const deleteDirectMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const msg = await DirectMessage.findById(messageId);
    if (!msg) return res.status(404).json({ success: false, error: "Message not found" });

    if (msg.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    await msg.remove();

    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete message" });
  }
};

// React to a message
export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const msg = await DirectMessage.findById(messageId);
    if (!msg) return res.status(404).json({ success: false, error: "Message not found" });

    const existingReaction = msg.reactions.find(
      (r) => r.user.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if already exists
      msg.reactions = msg.reactions.filter(
        (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
      );
    } else {
      // Add reaction
      msg.reactions.push({ emoji, user: userId });
    }

    await msg.save();
    await msg.populate("sender", "name profileImage");

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to react to message" });
  }
};
