import mongoose from "mongoose";

const pfSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    initialPf: { type: Number, default: 1500 },
    lastUpdatedPf: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    currentUpdatedPf: { type: Number, required: true },
    interestCompany: { type: Number, required: true },
    interestGovernment: { type: Number, required: true },
    total: { type: Number, required: true },
    lastUpdatedMonth: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Pf", pfSchema);
