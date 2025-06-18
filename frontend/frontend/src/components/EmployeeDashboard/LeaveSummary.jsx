import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaClock,
  FaPlaneDeparture,
  FaAward,
  FaThermometerHalf,
} from "react-icons/fa";
import axios from "axios";

const LeaveSummary = ({ userId }) => {
  const [leaveStats, setLeaveStats] = useState({
    totalLeave: 36,
    casualLeave: 24,
    earnedLeave: 12,
    sickLeave: 12,
  });

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const dayCount = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(dayCount, 0);
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/leave/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const leaves = res.data.leaves || [];

        // Filter approved leaves
        const approvedLeaves = leaves.filter(
          (leave) => leave.status === "Approved"
        );

        // Initialize counters
        let casualUsed = 0;
        let sickUsed = 0;
        let earnedUsed = 0;
        let totalUsed = 0;

        approvedLeaves.forEach((leave) => {
          const days = calculateLeaveDays(leave.startDate, leave.endDate);

          if (leave.leaveType === "Casual Leave") casualUsed += days;
          else if (leave.leaveType === "Sick Leave") sickUsed += days;
          else earnedUsed += days;

          totalUsed += days;
        });

        setLeaveStats({
          totalLeave: 36 - totalUsed,
          casualLeave: 24 - casualUsed,
          earnedLeave: 12 - earnedUsed,
          sickLeave: 12 - sickUsed,
        });
      } catch (error) {
        console.error("Failed to fetch leave data:", error);
      }
    };

    fetchLeaves();
  }, [userId]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FaClock />}
          text="Total Leave"
          number={leaveStats.totalLeave}
          color="bg-red-500"
        />
        <SummaryCard
          icon={<FaAward />}
          text="Earned Leave"
          number={leaveStats.earnedLeave}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaPlaneDeparture />}
          text="Casual Leave"
          number={leaveStats.casualLeave}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaThermometerHalf />}
          text="Sick Leave"
          number={leaveStats.sickLeave}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};

export default LeaveSummary;
