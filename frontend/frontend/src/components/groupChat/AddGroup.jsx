import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCog } from "react-icons/fa";
import { FiUpload, FiUserPlus, FiUserX } from "react-icons/fi";

const AddGroup = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [employees, setEmployees] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [groupDP, setGroupDP] = useState(null);
  const [members, setMembers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleAddMember = (id) => {
    if (!members.includes(id)) {
      setMembers((prev) => [...prev, id]);
    }
  };

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((mid) => mid !== id));
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

  const handleCreateGroup = async () => {
    try {
      const formData = new FormData();
      formData.append("group_name", groupName);
      if (groupDP) formData.append("group_dp", groupDP);
      members.forEach((id) => formData.append("members", id));

      const res = await axios.post("http://localhost:3000/api/group/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setSuccess("Group Created ✅");
        setGroupName("");
        setGroupDP(null);
        setMembers([]);
        setPreviewImage(null);
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err) {
      console.error("Group creation failed", err);
    }
  };

  return (
    <div className="flex h-full w-full bg-[url('/assets/chat-bg.jpg')] bg-cover bg-center">
            {/* Main Content Area */}
      <div className="flex-1 p-8 bg-white bg-opacity-50 overflow-y-auto">
        {activeTab === "groups" && (
          <div className="w-full max-w-md bg-white bg-opacity-70 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create New</h3>

            {/* Team Name */}
            <input
              type="text"
              placeholder="Enter Team Name"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-full text-center"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {/* Upload Icon */}
            <div className="flex justify-center mb-6">
              <label className="cursor-pointer relative inline-block">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Group" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <FiUpload className="text-2xl text-gray-500" />
                  )}
                </div>
              </label>
            </div>

            {/* Add Members */}
            <p className="font-bold mb-2">Add Members</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {employees.map((emp) => {
                const isMember = members.includes(emp.userId._id);
                return (
                  <div
                    key={emp.userId._id}
                    className="flex justify-between items-center text-sm py-2 px-2 hover:bg-gray-100 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`http://localhost:3000/${emp.userId.avatar?.replace("public/", "")}`}
                        alt={emp.userId.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div>
                        <p>{emp.userId.name}</p>
                        <p className="text-xs text-gray-500">{emp.department?.dep_name || "No Dept"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        isMember
                          ? handleRemoveMember(emp.userId._id)
                          : handleAddMember(emp.userId._id)
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

            {/* Create Button */}
            <button
              onClick={handleCreateGroup}
              className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded"
            >
              CREATE
            </button>

            {/* Success Message */}
            {success && (
              <p className="text-green-600 text-center mt-4 font-medium">{success}</p>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="text-gray-800">🔔 Notification settings coming soon...</div>
        )}

        {activeTab === "privacy" && (
          <div className="text-gray-800">🔒 Privacy options will appear here.</div>
        )}
      </div>
    </div>
  );
};

export default AddGroup;
