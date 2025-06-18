// models/Target.js
import mongoose from "mongoose";

const targetSchema = new mongoose.Schema(
  {
    subDepartment: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    targetNumber: {
      type: String,
      required: true,
      trim: true,
    },
    total_points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Target = mongoose.model("Target", targetSchema);
export default Target;
