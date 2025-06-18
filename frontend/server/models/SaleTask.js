import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    customer_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    college_email: { type: String, trim: true },
    contact_no: { type: String, required: true, trim: true },
    whatsapp_no: { type: String, trim: true },
    domain_interested: { type: String, trim: true },
    ticket_size: { type: Number, required: true },
    registration_amount: { type: Number, required: true },
    pending_amount: { type: Number, required: true },
    pending_date: { type: Date },
    program_type: {
      type: String,
      enum: ["Autonomous Learning", "Mentor Sync", "Accelerator"],
      required: true,
    },
    internship_start_date: { type: Date },
    internship_end_date: { type: Date },
    marketed_from: { type: String, trim: true },
    upload_image: { type: String, trim: true },

    // ✅ Certificate ID fields
    offer_letter_id: { type: String, trim: true },
    training_certificate_id: { type: String, trim: true },
    internship_certificate_id: { type: String, trim: true },

    // ✅ status field
    status: {
      type: String,
      enum: ["pending", "partial_done", "done", "default"],
      default: "pending",
    },

    // ✅ downloads field to track clicked buttons
    downloads: {
      certificate: { type: Boolean, default: false },
      internship: { type: Boolean, default: false },
      offer: { type: Boolean, default: false },
      done: { type: Boolean, default: false },
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    certificate_issued_on: { type: String },
    internship_issued_on: {
      type: String,
    },
    internship_date_range: { type: String },
  },
  {
    timestamps: false,
  }
);

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
