import Candidate from "../models/HrOnboarding.js";
import mongoose from "mongoose";

export const deleteOldOnboardedCandidates = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await Candidate.deleteMany({
      status: "onboarded",
      onboardedAt: { $lt: sevenDaysAgo },
    });

    console.log(`🗑️ Deleted ${result.deletedCount} onboarded candidates older than 7 days.`);
  } catch (err) {
    console.error("❌ Error deleting old onboarded candidates:", err.message);
  }
};
