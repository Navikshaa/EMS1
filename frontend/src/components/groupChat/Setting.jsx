import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCog } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FiUpload, FiUserPlus, FiUserX } from "react-icons/fi";

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDP, setGroupDP] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const [chatNotification, setChatNotification] = useState(false);
  const [groupNotification, setGroupNotification] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")); // ⬅️ get user from localStorage

  useEffect(() => {
    fetchGroups();
    fetchEmployees();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/group", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setGroups(res.data.groups || []);
      }
    } catch (error) {
      console.error("Failed to load groups.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/employee", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGroupDP(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (id) => {
    if (!members.includes(id)) {
      setMembers([...members, id]);
    }
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((m) => m !== id));
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

  const handleCreateGroup = async () => {
    try {
      const formData = new FormData();
      formData.append("group_name", groupName);
      if (groupDP) formData.append("group_dp", groupDP);
      members.forEach((id) => formData.append("members", id));

      const res = await axios.post(
        "http://localhost:3000/api/group/add",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setSuccess("Group Created ✅");
        setGroupName("");
        setGroupDP(null);
        setPreviewImage(null);
        setMembers([]);
        setSearchQuery("");
        setShowCreateForm(false);
        fetchGroups();
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err) {
      console.error("Group creation failed", err);
    }
  };

  return (
    <div className="flex h-full w-full bg-[url('/assets/chat-bg.jpg')] bg-cover bg-center">
      {/* Sidebar */}
      <div className="w-64 p-6 border-r bg-white bg-opacity-70">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <FaCog /> Setting
        </h2>
        <ul className="space-y-4 text-gray-700">
          <li
            className={`cursor-pointer hover:underline ${
              activeTab === "groups" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => {
              setActiveTab("groups");
              setShowCreateForm(false);
            }}
          >
            Groups
          </li>
          <li
            className={`cursor-pointer hover:underline ${
              activeTab === "notifications" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notification
          </li>
          <li
            className={`cursor-pointer hover:underline ${
              activeTab === "privacy" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </li>
        </ul>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-8 bg-white bg-opacity-50 overflow-y-auto">
        {activeTab === "groups" && (
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            {!showCreateForm ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Groups
                </h3>
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      className={`flex items-center justify-between px-4 py-2 rounded-full transition-all ${
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
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </div>
                  ))}
                </div>

                {/* ✅ Show button only for admin */}
                {user?.role === "admin" && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
                    >
                      Create New
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Create New Group
                </h3>
                <input
                  type="text"
                  placeholder="Enter Team Name"
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-full text-center"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />

                <div className="flex justify-center mb-6">
                  <label className="cursor-pointer relative inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Group"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <FiUpload className="text-2xl text-gray-500" />
                      )}
                    </div>
                  </label>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-full text-sm"
                />

                <p className="font-bold mb-2">Add Members</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {employees
                    .filter((emp) =>
                      emp.userId?.name
                        ?.toLowerCase()
                        .includes(searchQuery.trim().toLowerCase())
                    )
                    .map((emp) => {
                      const isMember = members.includes(emp._id);
                      return (
                        <div
                          key={emp._id}
                          className="flex justify-between items-center text-sm py-2 px-2 hover:bg-gray-100 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                emp.userId?.profileImage
                                  ? `http://localhost:3000/uploads/${emp.userId.profileImage}`
                                  : "http://localhost:3000/uploads/default-user.png"
                              }
                              alt={emp.userId?.name}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                            <div>
                              <p>{emp.userId?.name}</p>
                              <p className="text-xs text-gray-500">
                                {emp.department?.dep_name || "No Dept"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              isMember
                                ? handleRemoveMember(emp._id)
                                : handleAddMember(emp._id)
                            }
                            className="text-lg"
                          >
                            {isMember ? (
                              <FiUserX className="text-red-500 hover:text-red-700" />
                            ) : (
                              <FiUserPlus className="text-green-500 hover:text-green-700" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={handleCreateGroup}
                  className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded"
                >
                  CREATE
                </button>

                {success && (
                  <p className="text-green-600 text-center mt-4 font-medium">
                    {success}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="w-full max-w-md mx-auto bg-white bg-opacity-70 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">
              Notification
            </h3>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">
                Chat Notification:
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={chatNotification}
                  onChange={() => setChatNotification(!chatNotification)}
                />
                <div className="w-11 h-6 bg-red-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">
                Group Notification:
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={groupNotification}
                  onChange={() => setGroupNotification(!groupNotification)}
                />
                <div className="w-11 h-6 bg-red-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="text-gray-800 text-lg">
            🔒 Privacy options will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
