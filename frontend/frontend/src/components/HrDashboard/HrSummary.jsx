import React, { useEffect, useState } from "react";
import SummaryCard from "../dashboard/SummaryCard";
import AttendanceSummary from "../attendance/AttendanceSummary";
import { FaBuilding, FaUsers } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const HrSummary = () => {
  const { user } = useAuth();

  console.log("user details ", user);

  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:3000/api/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSummary(response.data);
      } catch (err) {
        setError("Failed to fetch summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  console.log("Passing userId to AttendanceSummary:", user?._id);

  if (loading) return <p className="text-center mt-4">Loading summary...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold mb-4">Dashboard Overview</h3>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employees"
          number={summary.totalEmployees}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-yellow-600"
        />
      </div>

      {/* Attendance Summary Section */}
      <div className="mt-12">
        <AttendanceSummary userId={user?._id} />
      </div>
    </div>
  );
};

export default HrSummary;
