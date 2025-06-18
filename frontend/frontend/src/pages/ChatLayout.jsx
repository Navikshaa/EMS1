// src/pages/ChatLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import GroupList from "../components/groupChat/GroupList.jsx";
import backgroundImage from "../assets/images/chat_background[1].png"; // ✅ your background image

const ChatLayout = () => {
  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay (optional blur/darken layer) */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0" />

      {/* Chat Content */}
      <div className="relative z-10 flex h-full">
        {/* Sidebar */}
        <div className="w-[300px] bg-white/80 backdrop-blur-md border-r shadow-lg">
          <GroupList />
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white/70 backdrop-blur-md shadow-xl p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
