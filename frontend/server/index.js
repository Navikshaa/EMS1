import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import { deleteOldOnboardedCandidates } from "./controllers/deleteOldOnboarded.js";
import connectToDatabase from "./db/db.js";
import GroupMessage from "./models/GroupMessage.js"; // ✅ import model

// Import routers
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import teamRouter from "./routes/team.js";
import leaveRouter from "./routes/leave.js";
import settingRouter from "./routes/setting.js";
import summaryRoutes from "./routes/summary.js";
import pfRouter from "./routes/pf.js";
import loginHistoryRoutes from "./routes/loginhistory.js";
import dashboardRouter from "./routes/dashboard.js";

import taskRoutes from "./routes/task.js";
import salesRoutes from "./routes/saleTask.js";
import targetRoutes from "./routes/target.js";
import adminRouter from "./routes/admin.js";
import groupRouter from "./routes/groupChat.js";
import groupMessageRouter from "./routes/groupMessage.js"; // ✅ Add this route
import directChatRoutes from "./routes/directChat.js";
import directMessageRoutes from "./routes/directMessage.js";
import certificateRoutes from "./routes/training.js";
import candidateRoutes from "./routes/hrOndording.js";
import internshipCertificateRouter from "./routes/internship.js";
import offerLetterRoutes from "./routes/offerletter.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectToDatabase();

// Initialize Express
const app = express();
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Or set your frontend URL here
    methods: ["GET", "POST"],
  },
});

cron.schedule("0 0 * * *", () => {
  console.log("🕛 Running daily cleanup job...");
  deleteOldOnboardedCandidates();
});
// Setup Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // ✅ ADD PATCH HERE
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Use Routes
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/team", teamRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/setting", settingRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/summary", summaryRoutes);
app.use("/api/pf", pfRouter);
app.use("/api/login-history", loginHistoryRoutes);

app.use("/api/task", taskRoutes);
app.use("/api/salestask", salesRoutes);
app.use("/api/targets", targetRoutes);

app.use("/api/admin", adminRouter);
app.use("/api/group", groupRouter);
app.use("/api/messages", groupMessageRouter);
app.use("/uploads/image", express.static("public/uploads/image"));
app.use("/uploads", express.static("public/uploads"));

app.use("/api/direct-chats", directChatRoutes);
app.use("/api/direct-messages", directMessageRoutes);
app.use("/api/candidates", candidateRoutes);

app.use("/api/certificate", certificateRoutes);
app.use("/api/internships", internshipCertificateRouter);
app.use("/api/offer-letter", offerLetterRoutes);

// ✅ Socket.io Logic
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // ✅ JOIN GROUP
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  // ✅ LEAVE GROUP (optional but good)
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`Socket ${socket.id} left group ${groupId}`);
  });

  // ✅ SEND MESSAGE
  socket.on("sendMessage", async ({ groupId, message, sender }) => {
    try {
      const savedMessage = await GroupMessage.create({
        groupId,
        message,
        sender,
      });

      const populatedMessage = await savedMessage.populate("sender", "name");
      io.to(groupId).emit("receiveMessage", populatedMessage);
    } catch (error) {
      console.error("Socket message error:", error.message);
    }
  });

  // User starts typing
  socket.on("typing", ({ groupId, user }) => {
    socket.to(groupId).emit("typing", { user });
  });

  // User stops typing
  socket.on("stopTyping", ({ groupId }) => {
    socket.to(groupId).emit("stopTyping");
  });

  // ✅ Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
