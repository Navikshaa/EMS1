import mongoose from "mongoose";
import { Schema } from "mongoose";

const employeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  nvkshPerno: {
    type: Number,
    required: true,
    unique: true,
  },
  nvkshUnitPerno: {
    type: Number,
    required: true,
    unique: true,
  },
  grade: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  pan: {
    type: String,
    required: true,
    unique: true,
  },
  aadhar: {
    type: Number,
    required: true,
    unique: true,
  },
  permanentaddress: {
    type: String,
    required: false,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  correspondenceAddress: {
    type: String,
    required: false,
  },
  correspondenceAddress1: {
    type: String,
  },
  correspondenceAddress2: {
    type: String,
  },
  bankac: {
    type: Number,
    required: true,
  },
  bankname: {
    type: String,
    required: true,
  },
  bankacname: {
    type: String,
    required: true,
  },
  branchname: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["savings", "current"],
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  doj: {
    type: Date,
  },
  dob: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    default: "active",
  },
  gender: {
    type: String,
  },
  nationality: {
    type: String,
  },
  hire: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  designation: {
    type: String,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  role: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
