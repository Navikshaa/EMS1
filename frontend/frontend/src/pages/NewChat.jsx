// src/pages/NewChat.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";


const NewChat = () => {
  const [employees, setEmployees] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const startChat = async (userId) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/direct-chats",
        { recipientId: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        navigate(`/${user?.role}-dashboard/groups/direct/${res.data.chat._id}`);
      }
    } catch (err) {
      console.error("Error starting chat", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Start a New Chat</h2>
      <div className="grid grid-cols-1 gap-3 max-w-md">
        {employees.map((emp) => {
          return (
            <div
              key={emp.userId._id}
              onClick={() => startChat(emp.userId._id)}
              className="flex items-center justify-between p-3 bg-white rounded shadow hover:bg-blue-50 cursor-pointer"
            >
              <div>
                <p className="font-medium">{emp.userId.name || "Unnamed"}</p>
                <p className="text-sm text-gray-500">
                  {emp.department?.dep_name || "No Department"}
                </p>
              </div>
              <img
                src={`http://localhost:3000/${emp.userId.avatar?.replace(
                  "public/",
                  ""
                )}`}
                alt={emp.userId.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewChat;
