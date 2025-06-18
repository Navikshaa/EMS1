// models/NotificationSetting.js
import mongoose from "mongoose";

const notificationSettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    unique: true,
  },
  chatNotification: {
    type: Boolean,
    default: true,
  },
  groupNotification: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("NotificationSetting", notificationSettingSchema);
