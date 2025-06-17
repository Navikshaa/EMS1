import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { FaFilter, FaRegClock } from "react-icons/fa";
import "./AttendanceCalendar.css";

const AttendanceCalendar = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const formatDisplayDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "On Time":
        return "bg-green-500";
      case "Late":
        return "bg-orange-400";
      case "Half Day":
        return "bg-pink-400";
      case "Holiday":
        return "bg-gray-400";
      case "Sunday":
        return "bg-blue-400";
      default:
        return "bg-gray-300"; // No Login or others
    }
  };

  const fetchAttendance = async () => {
    try {
      if (!user?._id) return;

      const res = await axios.get(
        `http://localhost:3000/api/login-history/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = res.data.data.map((entry) => {
        const loginTime = entry.loginTime
          ? new Date(entry.loginTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : null;

        const logoutTime = entry.logoutTime
          ? new Date(entry.logoutTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : null;

        return {
          date: new Date(entry.date).toLocaleDateString("en-CA"),
          status: entry.status || "No Login",
          loginTime,
          logoutTime,
        };
      });

      const reversed = [...formatted].reverse();
      setAttendanceData(reversed);
      setFilteredData(reversed);
    } catch (err) {
      console.error("Error fetching login history:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAttendance();
    }
  }, [user]);

  const handleDateSelect = (date) => {
    const selected = formatDate(date);
    setSelectedDate(selected);
    const filtered = attendanceData.filter((entry) => entry.date === selected);
    setFilteredData(filtered);
    setShowCalendar(false);
  };

  const clearFilter = () => {
    setSelectedDate(null);
    setFilteredData(attendanceData);
  };

  return (
    <div className="relative px-4 py-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold border-l-4 border-green-600 pl-2 uppercase">
          Attendance Detail
        </h2>
        <div className="flex items-center gap-2">
          {selectedDate && (
            <button
              onClick={clearFilter}
              className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold text-sm"
            >
              Clear Filter
            </button>
          )}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-white px-4 py-2 rounded-full shadow flex items-center gap-2 font-semibold"
          >
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-2 right-3 text-red-500 font-bold"
            >
              ✕
            </button>
            <Calendar onChange={handleDateSelect} />
          </div>
        </div>
      )}

      {/* Attendance Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((entry, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all w-full max-w-[300px] mx-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <FaRegClock className="text-gray-500" />
                <span className="font-semibold">
                  {formatDisplayDate(entry.date)}
                </span>
              </div>
              <span
                className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                  entry.status
                )}`}
              >
                {entry.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between mt-3 text-center">
              <div>
                <p className="text-lg font-bold">{entry.loginTime || "—"}</p>
                <p className="text-xs text-gray-500">Check In</p>
              </div>
              <div>
                <p className="text-lg font-bold">{entry.logoutTime || "—"}</p>
                <p className="text-xs text-gray-500">Check Out</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
