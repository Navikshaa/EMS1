// models/DirectChat.js
import mongoose from "mongoose";
import { Schema } from "mongoose";


const directChatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ✅ Switch from "Employee" to "User"
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("DirectChat", directChatSchema);
