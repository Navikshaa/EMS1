import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaFilter, FaRegClock } from "react-icons/fa";
import "./AttendanceCalendar.css";
import { useParams } from "react-router-dom";

const AttendanceCalendar = () => {
  const { userId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editModalData, setEditModalData] = useState(null);

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
        return "bg-gray-300";
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/login-history/${userId}`
      );
      const formatted = res.data.data.map((entry) => {
        return {
          id: entry._id,
          date: new Date(entry.date).toLocaleDateString("en-CA"),
          status: entry.status || "No Login",
          loginTime: entry.loginTime
            ? new Date(entry.loginTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : null,
          logoutTime: entry.logoutTime
            ? new Date(entry.logoutTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : null,
          rawLogin: entry.loginTime,
          rawLogout: entry.logoutTime,
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
    if (userId) fetchAttendance();
  }, [userId]);

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

  const openEditModal = (entry) => {
    setEditModalData({
      ...entry,
      loginTime: entry.rawLogin ? entry.rawLogin.slice(0, 16) : "",
      logoutTime: entry.rawLogout ? entry.rawLogout.slice(0, 16) : "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const formattedDate = new Date(editModalData.date)
        .toISOString()
        .split("T")[0]; // ensures 'YYYY-MM-DD'
      await axios.put(
        `http://localhost:3000/api/login-history/edit/${userId}`,
        {
          loginTime: new Date(editModalData.loginTime),
          logoutTime: new Date(editModalData.logoutTime),
          date: formattedDate,
        }
      );
      setEditModalData(null);
      fetchAttendance();
    } catch (err) {
      console.error("Error updating attendance:", err.response?.data || err);
    }
  };

  return (
    <div className="relative px-4 py-4 bg-white min-h-screen">
      <h2 className="text-xl font-bold mb-1 text-center">Attendance Detail</h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        To edit attendance, simply click on a date card.
      </p>

      <div className="flex justify-end mb-4 pr-4">
        {selectedDate && (
          <button
            onClick={clearFilter}
            className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm mr-2"
          >
            Clear Filter
          </button>
        )}
        <button
          onClick={() => setShowCalendar(true)}
          className="bg-white border px-4 py-2 rounded-full shadow font-semibold flex items-center gap-2"
        >
          <FaFilter /> Filter
        </button>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((entry, idx) => (
          <div
            key={idx}
            onClick={() => openEditModal(entry)}
            className="bg-white cursor-pointer rounded-xl p-3 shadow-md hover:shadow-lg transition-all max-w-[300px] mx-auto"
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

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-red-600 font-bold"
              onClick={() => setEditModalData(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Attendance</h3>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Check In Time</span>
                <input
                  type="datetime-local"
                  name="loginTime"
                  value={editModalData.loginTime}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Check Out Time</span>
                <input
                  type="datetime-local"
                  name="logoutTime"
                  value={editModalData.logoutTime}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Status</span>
                <select
                  name="status"
                  value={editModalData.status}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                >
                  <option value="On Time">On Time</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Sunday">Sunday</option>
                  <option value="No Login">No Login</option>
                </select>
              </label>
              <button
                onClick={handleEditSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
