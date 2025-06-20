import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext"; // ✅ using role from auth context
import API_ENDPOINTS from "../../config/api";

const SettingsPanel = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // ✅ get user from context

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GROUP.BASE, {
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
      return `${API_ENDPOINTS.IMAGE_UPLOAD.BASE}/default-user.png`;
    }
    const cleanedPath = path.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    return `${API_ENDPOINTS}/${cleanedPath}`;
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
              onClick={() => navigate(`/admin-dashboard/groups/${group._id}`)}
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

        {/* ✅ Create Group Button - only for admin */}
        {user && user.role && user.role.toLowerCase() === "admin" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                navigate("/admin-dashboard/groups/setting/addgroup")
              }
              className="px-6 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
            >
              Create New
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
