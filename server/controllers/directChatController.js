import DirectChat from "../models/DirectChat.js";
import User from "../models/User.js";

// Create or fetch a chat between two users
export const createOrGetChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user._id;

    let chat = await DirectChat.findOne({
      users: { $all: [userId, recipientId] },
    }).populate("users", "name avatar");

    if (!chat) {
      chat = await DirectChat.create({ users: [userId, recipientId] });
      await chat.populate("users", "name avatar");
    }

    const recipient = chat.users.find((u) => u._id.toString() !== userId.toString());

    res.json({ success: true, chat: { _id: chat._id, recipient } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create/get chat" });
  }
};

// Get all chats for current user
export const getAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await DirectChat.find({ users: userId })
      .populate("users", "name avatar")
      .sort({ updatedAt: -1 });

    const formatted = chats.map((chat) => {
      const recipient = chat.users.find(
        (u) => u._id.toString() !== userId.toString()
      );
      return { _id: chat._id, recipient };
    });

    res.json({ success: true, chats: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to load chats" });
  }
};

// Get one chat info
export const getChatById = async (req, res) => {
  try {
    const chat = await DirectChat.findById(req.params.id).populate("users", "name avatar");
    if (!chat) return res.status(404).json({ success: false, error: "Chat not found" });

    const recipient = chat.users.find((u) => u._id.toString() !== req.user._id.toString());
    res.json({ success: true, chat: { _id: chat._id, recipient } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to get chat" });
  }
};
