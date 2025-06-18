import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./team.css";
import API_ENDPOINTS from "../../config/api";

const TeamList = () => {
  const [groupedTeams, setGroupedTeams] = useState({});

  const fetchTeams = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.TEAM.BASE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const teams = response.data.teams;

        // Normalize teams and group by department
        const grouped = teams.reduce((acc, team) => {
          const departmentName = team.department?.dep_name || "Unassigned";
          const normalizedTeam = {
            ...team,
            team_leader: team.leaderUserId || null,
          };

          if (!acc[departmentName]) acc[departmentName] = [];
          acc[departmentName].push(normalizedTeam);
          return acc;
        }, {});
        setGroupedTeams(grouped);
      }
    } catch (error) {
      alert("Failed to load teams.");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const getCleanImageUrl = (team_dp) => {
    if (!team_dp) return "https://via.placeholder.com/100";
    const cleanedPath = team_dp.replace("public\\", "").replace(/\\/g, "/");
    return `${API_ENDPOINTS}/${cleanedPath}`;
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Teams by Department</h3>
        <Link
          to="/admin-dashboard/add-team"
          className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-800 text-white shadow-lg"
        >
          Add Team
        </Link>
      </div>

      <div className="space-y-10">
        {Object.entries(groupedTeams).map(([department, teams]) => (
          <div key={department}>
            <h4 className="text-xl font-semibold mb-3 text-gray-700">
              {department}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {teams.map((team) => (
                <div key={team._id} className="flip-card w-full h-48 relative">
                  <div className="flip-card-inner w-full h-full">
                    {/* Front Side */}
                    <div className="flip-card-front bg-white p-4 rounded-xl shadow text-center flex flex-col items-center justify-center relative">
                      <img
                        src={getCleanImageUrl(team.team_dp)}
                        alt={team.team_name}
                        className="w-24 h-24 rounded-full object-cover border border-gray-300"
                      />
                      <div className="text-sm font-medium text-gray-800 mt-2">
                        {team.team_name}
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="flip-card-back bg-blue-800 text-white rounded-xl shadow flex flex-col items-center justify-center p-4 text-sm">
                      <div className="bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded mb-2">
                        {team.team_name}
                      </div>
                      <br />
                      <div>
                        Leader - {team.team_leader?.name || "No Leader"}
                      </div>
                      <br />
                      <Link
                        to={`/admin-dashboard/teams/team/${team._id}`}
                        className="px-3 py-1 bg-white text-blue-800 font-semibold rounded hover:bg-gray-200 transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
