import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

const EmViewTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState([]);

  // Fetch the team info
  const fetchTeam = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/team/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const teamData = response.data.team;
        setTeam(teamData);

        // Fetch leader employee data
        if (teamData.leaderUserId?._id) {
          const leaderRes = await axios.get(
            `http://localhost:3000/api/employee/${teamData.leaderUserId._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setLeaderProfile(leaderRes.data.employee);
        }

        // Fetch members employee data
        const members = teamData.memberUserIds || [];
        const memberData = await Promise.all(
          members.map(async (member) => {
            const res = await axios.get(
              `http://localhost:3000/api/employee/${member._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return res.data.employee;
          })
        );
        setMemberProfiles(memberData);
      }
    } catch (error) {
      console.error("Error loading team:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const getProfileImage = (employee) => {
    return employee?.userId?.profileImage
      ? `http://localhost:3000/uploads/${employee.userId.profileImage}`
      : "https://www.gravatar.com/avatar/?d=mp&f=y";
  };

  const getTeamImage = (path) => {
    if (!path) return "https://www.gravatar.com/avatar/?d=mp&f=y";
    const cleaned = path.replace("public\\", "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleaned}`;
  };

  if (!team) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-52">
        <img
          src="/assets/images/team-header.jpg"
          alt="Team Header"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Team Name Card */}
        <div className="bg-blue-100 w-80 mx-auto rounded-lg p-6 flex flex-col items-center text-center shadow">
          <img
            src={getTeamImage(team.team_dp)}
            alt="Team Logo"
            className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow"
          />
          <h2 className="text-xl font-bold text-gray-800">{team.team_name}</h2>
        </div>

        {/* Team Leader Full Width */}
        {leaderProfile && (
          <div className="bg-blue-50 rounded-lg p-6 flex items-center gap-6 shadow">
            <img
              src={getProfileImage(leaderProfile)}
              alt="Leader"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
            />
            <div className="flex-1 text-center">
              <h3 className="text-lg font-bold text-gray-700 mb-1">TEAM LEADER</h3>
              <p className="text-base text-gray-800">
                {leaderProfile.userId.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                NUMBER OF MEMBERS = {team.memberUserIds?.length || 0}
              </p>
            </div>
          </div>
        )}

        {/* Team Members Cards */}
        <div className="bg-blue-100 w-80 mx-auto rounded-lg p-6 shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-800 text-center">TEAM MEMBERS</h3>
          <div className="space-y-4">
            {memberProfiles.map((employee) => (
              <div
                key={employee._id}
                className="flex items-center justify-between bg-white p-2 rounded shadow"
              >
                <span className="text-gray-800 text-sm font-medium">
                  {employee.userId.name}
                </span>
                <img
                  src={getProfileImage(employee)}
                  alt={employee.userId.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmViewTeam;
