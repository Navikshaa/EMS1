import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "employee", "hr", "leader", "manager"],
    required: true,
  },
  profileImage: { type: String },
  firstLogin: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});

const User = mongoose.model("User", userSchema);
export default User;
