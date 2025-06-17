import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String },
  department: { type: String },
  status: { type: String },
  loginAt: { type: Date, default: Date.now },
  logoutAt: { type: Date, default: null },
  shiftDate: { type: String },
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
export default LoginHistory;
