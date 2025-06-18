import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    team_name: { type: String, required: true, unique: true },
    team_dp: { type: String },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    designation: {
      type: String,
    },

    leaderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
