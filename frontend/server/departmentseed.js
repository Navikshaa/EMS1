import mongoose from "mongoose";
import Department from "./models/Department.js";
import connectToDatabase from "./db/db.js";

const predefinedDepartments = [
  {
    dep_name: "IT",
    description: "Handles all tech infrastructure",
  },
  {
    dep_name: "HR",
    description: "Human Resources department",
  },
  {
    dep_name: "Sales",
    description: "Sales and business development",
  },
  { dep_name: "Finance", description: "Handles financial operations" },
  { dep_name: "Marketing", description: "Marketing and promotions" },
  { dep_name: "Compliance", description: "Compliance and regulation" },
  { dep_name: "Operations", description: "Operations and logistics" },
];

const seedDepartments = async () => {
  try {
    await connectToDatabase();
    await Department.deleteMany();
    await Department.insertMany(predefinedDepartments);
    console.log("✅ Departments seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding departments:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDepartments();
