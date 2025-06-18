// controllers/notificationController.js
import NotificationSetting from "../models/NotificationSetting.js";

export const getNotificationSettings = async (req, res) => {
  try {
    const setting = await NotificationSetting.findOne({ user: req.user._id });
    if (!setting) {
      return res.json({ chatNotification: true, groupNotification: true }); // default
    }
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notification settings" });
  }
};

export const saveNotificationSettings = async (req, res) => {
  try {
    const { chatNotification, groupNotification } = req.body;

    const updated = await NotificationSetting.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        chatNotification,
        groupNotification,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, settings: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save notification settings" });
  }
};

