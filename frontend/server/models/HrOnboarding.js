import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  candidate_name: String,
  email: String,
  contact_no: String,
  whatsapp_no: String,
  date_of_joining: Date,
  profile_type: String,
  status: {
    type: String,
    enum: ["pending", "onboarded", "rejected"],
    default: "pending",
  },
  onboardedAt: Date, // 🆕 Add this field
});

export default mongoose.model("Candidate", candidateSchema);
