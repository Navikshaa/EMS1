import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCog, FaBell, FaComments } from "react-icons/fa";
import logo1 from "../../assets/images/logo1.png";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/authContext";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [directChats, setDirectChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [bellRing, setBellRing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const { user } = useAuth();

  const fetchGroups = async () => {
    try {
      const endpoint =
        user?.role === "admin"
          ? "http://localhost:3000/api/group"
          : "http://localhost:3000/api/group/my-groups";

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setGroups(res.data.groups || []);
      }
    } catch (error) {
      console.error("Failed to load groups.");
    }
  };

  const fetchDirectChats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/direct-chats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setDirectChats(res.data.chats || []);
    } catch (err) {
      console.error("Failed to load direct chats");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchDirectChats();
  }, [user?.role]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (msg) => {
      const isCurrentGroup =
        location.pathname === `/admin-dashboard/groups/${msg.groupId}`;
      const isCurrentDirect =
        location.pathname === `/admin-dashboard/groups/direct/${msg.chatId}`;

      if (!isCurrentGroup && !isCurrentDirect) {
        const key = msg.groupId || msg.chatId;
        setUnreadCounts((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }));

        setBellRing(true);
        setTimeout(() => setBellRing(false), 1000);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, location.pathname]);

  const handleOpenChat = (type, id) => {
    const dashboardPrefix =
      user?.role === "admin"
        ? "/admin-dashboard"
        : user?.role === "hr"
        ? "/hr-dashboard"
        : "/employee-dashboard";

    const path =
      type === "group"
        ? `${dashboardPrefix}/groups/${id}`
        : `${dashboardPrefix}/groups/direct/${id}`;

    navigate(path);

    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const dashboardPrefix =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "hr"
      ? "/hr-dashboard"
      : "/employee-dashboard";

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") {
      return "http://localhost:3000/uploads/default-user.png";
    }
    const cleanedPath = path.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleanedPath}`;
  };

  return (
    <div className="flex flex-col h-screen w-72 bg-white border-r shadow-md relative">
      {/* Top Banner */}
      <div
        className="relative w-full h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${logo1})` }}
      >
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 w-20 h-20 border-4 border-white rounded-full overflow-hidden shadow-lg bg-white">
          <img src={logo1} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="mt-12 px-2 overflow-y-auto flex-1">
        {/* Group Chats */}
        <div className="mt-2">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => handleOpenChat("group", group._id)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-full transition-all mb-1 ${
                location.pathname === `/admin-dashboard/groups/${group._id}`
                  ? "bg-blue-100 shadow-inner"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 truncate">
                {group.group_name}
                {unreadCounts[group._id] > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCounts[group._id]}
                  </span>
                )}
              </div>
              <img
                src={getImageUrl(group.group_dp)}
                alt={group.group_name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            </div>
          ))}
        </div>

        {/* Direct Chats (Only for admin) */}
        {directChats.length > 0 && (
          <div className="mt-4 border-t pt-2">
            <p className="text-xs text-gray-500 pl-4 mb-1">Chats</p>
            {directChats.map((chat) => {
              const name = chat.recipient?.name || "Unnamed";
              const profileImage = chat.recipient?.profileImage
                ? `http://localhost:3000/uploads/${chat.recipient.profileImage}`
                : "http://localhost:3000/uploads/default-user.png";

              return (
                <div
                  key={chat._id}
                  onClick={() => handleOpenChat("direct", chat._id)}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-full transition-all mb-1 ${
                    location.pathname ===
                    `/admin-dashboard/groups/direct/${chat._id}`
                      ? "bg-blue-100 shadow-inner"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800 truncate">
                    {name}
                    {unreadCounts[chat._id] > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCounts[chat._id]}
                      </span>
                    )}
                  </div>
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate(`${dashboardPrefix}/groups/setting`)}
            className={`text-gray-500 hover:text-blue-600 ${
              location.pathname.includes("/groups/setting")
                ? "text-blue-600"
                : ""
            }`}
            title="Settings"
          >
            <FaCog className="text-lg" />
          </button>

          <FaBell
            className={`text-lg cursor-pointer transition ${
              bellRing ? "text-red-500 animate-bounce" : "text-gray-500"
            }`}
            title="Notification"
          />
        </div>

        <button
          onClick={() => navigate(`${dashboardPrefix}/groups/new-chat`)}
          className={`bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full ${
            location.pathname.includes("/groups/new-chat")
              ? "ring-2 ring-blue-400"
              : ""
          }`}
          title="Start New Chat"
        >
          <FaComments className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default GroupList;
