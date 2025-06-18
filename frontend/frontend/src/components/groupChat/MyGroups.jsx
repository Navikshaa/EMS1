import React, { useEffect, useState } from "react";
import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const EmployeeChatLayout = () => {
  const [groups, setGroups] = useState([]);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/group/my-groups", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setGroups(res.data.groups);
        }
      } catch (err) {
        console.error("Group fetch error:", err);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border-r shadow-md flex flex-col">
        {/* Header */}
        <div className="p-4 text-center border-b">
          <img
            src="/assets/logo.png" // your logo path
            alt="Logo"
            className="w-16 h-16 mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold text-blue-700">My Groups</h2>
        </div>

        {/* Group List */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-3">
          {groups.map((group) => (
            <Link
              key={group._id}
              to={`/employee-dashboard/groups/${group._id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition ${
                location.pathname.endsWith(group._id)
                  ? "bg-blue-100 border-l-4 border-blue-600"
                  : ""
              }`}
            >
              <img
                src={
                  group.group_dp
                    ? `http://localhost:3000/${group.group_dp.replace("public/", "")}`
                    : "https://via.placeholder.com/50"
                }
                alt={group.group_name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="text-sm font-medium text-gray-800 truncate">
                {group.group_name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeChatLayout;
