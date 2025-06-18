import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";

const DetailLeave = ({ id, onClose }) => {
  const [leave, setLeave] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          const leaveData = response.data.leave;
          setLeave(leaveData);
          setDateRange([
            new Date(leaveData.startDate),
            new Date(leaveData.endDate),
          ]);
        }
      } catch (error) {
        alert("Error fetching leave details");
      }
    };

    if (id) fetchLeave();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      const [startDate, endDate] = dateRange;
      const response = await axios.put(
        `http://localhost:3000/api/leave/${id}`,
        { status, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        onClose();
      }
    } catch (error) {
      alert("Error updating leave status");
    }
  };

  if (!leave)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg text-center">Loading...</div>
      </div>
    );

  const isPending = leave?.status?.toLowerCase() === "pending";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[75vh] flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600 z-10"
        >
          ✕
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 pr-8 pb-32">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:3000/uploads/${leave.employeeId.userId.profileImage}`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-2xl font-bold uppercase">
                  {leave.employeeId?.name}
                </h1>
                <p className="text-xl">{leave.employeeId.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Calendar + Reason */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar */}
            <div className="bg-white p-4 rounded-md shadow-md w-full md:w-1/2">
              <Calendar
                selectRange
                value={dateRange}
                onChange={(range) => setDateRange(range)}
                tileClassName={({ date }) => {
                  const [start, end] = dateRange;
                  if (date >= start && date <= end) return "highlight";
                  if (date.getDay() === 0) return "sunday-bg";
                  if (date.getDay() === 6) return "saturday-bg";
                  return null;
                }}
              />
            </div>

            {/* Reason Box */}
            <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 min-h-[250px] flex flex-col">
              <h2 className="text-xl font-bold text-center mb-2 tracking-wider">
                REASON
              </h2>
              <p className="text-gray-800 px-2">{leave.reason}</p>
            </div>
          </div>

          {/* Status */}
          <p className="text-center text-sm text-gray-600 mt-6">
            <strong>Status:</strong> {leave.status}
          </p>
        </div>

        {/* Fixed Action Buttons */}
        {isPending && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center gap-6 z-10">
            <button
              onClick={() => changeStatus("Approved")}
              className="bg-[#bde5c8] text-green-700 font-bold text-lg px-10 py-3 rounded-full"
            >
              APPROVE
            </button>
            <button
              onClick={() => changeStatus("Rejected")}
              className="bg-[#f5c3c3] text-red-700 font-bold text-lg px-10 py-3 rounded-full"
            >
              REJECT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailLeave;
