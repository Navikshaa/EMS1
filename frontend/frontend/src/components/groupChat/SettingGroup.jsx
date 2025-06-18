import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCog } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [chatNotification, setChatNotification] = useState(false);
const [groupNotification, setGroupNotification] = useState(true);


  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/group", {
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

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") {
      return "http://localhost:3000/uploads/default-user.png";
    }
    const cleanedPath = path.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleanedPath}`;
  };

  const isGroupActive = (groupId) =>
    location.pathname === `/admin-dashboard/groups/${groupId}`;

  return (
    <div className="flex h-full w-full bg-[url('/assets/chat-bg.jpg')] bg-cover bg-center">

      {/* Main Content */}
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Groups</h3>
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() =>
                    navigate(`/admin-dashboard/groups/${group._id}`)
                  }
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-full transition-all ${
                    isGroupActive(group._id)
                      ? "bg-blue-100 shadow-inner"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {group.group_name}
                  </div>
                  <img
                    src={getImageUrl(group.group_dp)}
                    alt={group.group_name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                </div>
              ))}
            </div>

            {/* Create New Group Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/admin-dashboard/groups/setting/addgroup")}
                className="px-6 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
              >
                Create New
              </button>
            </div>
          </div>

      </div>
  );
};

export default SettingsPanel;
