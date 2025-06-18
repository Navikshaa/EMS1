import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("PrivateMessage", privateMessageSchema);
