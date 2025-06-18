import Candidate from "../models/HrOnboarding.js";
import mongoose from "mongoose";

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addCandidate = async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.status(201).json({ message: "Candidate added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData = { status };
    if (status === "onboarded") {
      updateData.onboardedAt = new Date(); // ⏱️ Set timestamp
    }

    const updated = await Candidate.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
