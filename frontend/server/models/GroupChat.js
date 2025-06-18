import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    group_dp: {
      type: String, // file path of image
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
export default GroupChat;
