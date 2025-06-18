// models/DirectMessage.js
import mongoose from "mongoose";
import { Schema } from "mongoose";


// models/DirectMessage.js

const directMessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "DirectChat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    file: { type: String },
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    reactions: [
      {
        emoji: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    editedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("DirectMessage", directMessageSchema);