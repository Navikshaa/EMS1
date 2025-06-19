// src/pages/ChatLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import GroupList from "../components/groupChat/GroupList.jsx";
import backgroundImage from "../assets/images/chat_background[1].png"; // ✅ your background image

const ChatLayout = () => {
  return (
    <div
      className="relative h-screen w-full overflow-hidden "
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "125% auto", // ✅ stretch width
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay (optional blur/darken layer) */}
      <div className="absolute inset-0 z-0" />

      {/* Chat Content */}
      <div className="relative z-10 flex h-full">
        {/* Sidebar */}
        <div className="w-[300px]  border-r shadow-lg">
          <GroupList />
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-transparent p-1"
       >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
