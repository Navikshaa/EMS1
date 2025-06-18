import Group from "../models/GroupChat.js";

export const createGroup = async (req, res) => {
  try {
    const { group_name, members } = req.body;

    if (!group_name || !members) {
      return res
        .status(400)
        .json({ success: false, error: "Group name and members are required" });
    }

    const groupExists = await Group.findOne({ group_name });
    if (groupExists) {
      return res
        .status(400)
        .json({ success: false, error: "Group with this name already exists" });
    }

    const group = new Group({
      group_name,
      createdBy: req.user._id,
      members: Array.isArray(members) ? members : [members],
      group_dp: req.file ? req.file.path : null,
    });

    await group.save();

    res.status(201).json({ success: true, message: "Group created", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("createdBy", "name")
      .populate("members", "name");

    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("createdBy", "name")
      .populate("members", "name");

    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("members", "name");

    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    const isMember = group.members.some((member) =>
      member._id.equals(req.user._id)
    );

    if (!isMember && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    res.status(200).json({ success: true, group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const addGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    // Only allow admin to add members
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const { members } = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ success: false, error: "Members array required" });
    }

    // Avoid duplicates
    const newMembers = members.filter(
      (id) => !group.members.some((m) => m.toString() === id)
    );
    group.members.push(...newMembers);

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("members", "name")
      .populate("createdBy", "name");

    res.json({ success: true, group: updatedGroup });
  } catch (err) {
    console.error("Add members failed:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

