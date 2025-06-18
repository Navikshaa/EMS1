import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Plus, X, Trash } from "lucide-react";
import Modal from "./Modal";

const ViewTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditLeader, setShowEditLeader] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/team/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const fetchedTeam = response.data.team;
          // Normalize the team object to match frontend expectations
          setTeam({
            ...fetchedTeam,
            team_leader: fetchedTeam.leaderUserId || null,
            team_members: fetchedTeam.memberUserIds || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmployees(response.data.employees || []);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchTeam();
    fetchEmployees();
  }, [id]);

  const getImageUrl = (path) => {
    if (!path) return "https://www.gravatar.com/avatar/?d=mp&f=y";
    const cleaned = path.replace("public\\", "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleaned}`;
  };

  const handleLeaderChange = async (leaderUserId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/team/${id}/leader`,
        { leaderUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newLeader =
        employees.find((e) => e.userId._id === leaderUserId)?.userId || null;
      setTeam((prev) => ({
        ...prev,
        team_leader: newLeader,
      }));
      setShowEditLeader(false);
    } catch (error) {
      console.error("Error updating leader:", error);
    }
  };

  const handleMemberToggle = async (memberUserId) => {
    const isAlreadyMember = team.team_members.some(
      (m) => m._id === memberUserId
    );

    const newMembers = isAlreadyMember
      ? team.team_members.filter((m) => m._id !== memberUserId)
      : [
          ...team.team_members,
          employees.find((e) => e.userId._id === memberUserId)?.userId,
        ];

    try {
      await axios.put(
        `http://localhost:3000/api/team/${id}/members`,
        { memberUserIds: newMembers.map((m) => m._id) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTeam((prev) => ({
        ...prev,
        team_members: newMembers,
      }));
    } catch (error) {
      console.error("Error updating members:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/team/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/teams");
    } catch (err) {
      alert("Failed to delete team.");
    }
  };

  if (!team) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
      >
        <X size={24} /> <span className="ml-2">Back</span>
      </button>

      <h2 className="text-3xl font-bold text-center mb-6">{team.team_name}</h2>

      {/* Team Leader Section */}
      <div className="relative border p-6 rounded mb-6 flex items-center gap-6 bg-white shadow">
        <button
          onClick={() => setShowEditLeader(true)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <Pencil size={20} />
        </button>
        <img
          src={getImageUrl(team.team_leader?.profileImage)}
          alt="Leader"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-medium">
            {team.team_leader?.name || "N/A"}
          </h3>
          <p className="text-sm text-gray-600">
            ID: {team.team_leader?._id || "N/A"}
          </p>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="relative border p-6 rounded bg-white shadow">
        <button
          onClick={() => setShowAddMember(true)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <Plus size={22} />
        </button>
        <h3 className="text-xl font-semibold text-center mb-6">Team Members</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {team.team_members?.map((member) => (
            <div key={member._id} className="flex flex-col items-center">
              <img
                src={getImageUrl(member.profileImage)}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border mb-2"
              />
              <span className="text-sm font-medium text-center">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Team */}
      <div className="mt-8 text-center">
        <button
          onClick={() => handleDelete(team._id)}
          className="text-red-600 hover:text-red-800 flex items-center gap-2 justify-center mx-auto text-sm"
        >
          <Trash size={18} /> Delete Team
        </button>
      </div>

      {/* Modal: Select Leader */}
      <Modal isOpen={showEditLeader} onClose={() => setShowEditLeader(false)}>
        <h3 className="text-lg font-bold mb-4">Select Team Leader</h3>
        <ul className="space-y-2 pr-2 max-h-64 overflow-y-auto">
          {employees.map((emp) => (
            <li
              key={emp.userId._id}
              className="flex justify-between items-center"
            >
              <span>{emp.userId.name}</span>
              <button
                onClick={() => handleLeaderChange(emp.userId._id)}
                className="text-blue-600 hover:text-blue-800"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      {/* Modal: Manage Members */}
      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)}>
        <h3 className="text-lg font-bold mb-4">Manage Team Members</h3>
        <ul className="space-y-2 pr-2 max-h-64 overflow-y-auto">
          {employees.map((emp) => {
            const isMember = team.team_members?.some(
              (m) => m._id === emp.userId._id
            );
            return (
              <li
                key={emp.userId._id}
                className="flex justify-between items-center"
              >
                <span>{emp.userId.name}</span>
                <button
                  onClick={() => handleMemberToggle(emp.userId._id)}
                  className={`px-2 py-1 rounded ${
                    isMember ? "bg-red-200" : "bg-green-200"
                  }`}
                >
                  {isMember ? "Remove" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      </Modal>
    </div>
  );
};

export default ViewTeam;
