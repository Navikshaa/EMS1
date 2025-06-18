import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { FaUserCircle, FaCalendarAlt, FaCog } from "react-icons/fa";

// Color map for attendance status
const attendanceColors = {
  onTime: "bg-green-600",
  halfDay: "bg-pink-500",
  absent: "bg-red-600",
  late: "bg-orange-500",
  Unknown: "bg-white border border-gray-400", // white circle with border
};

const getWeekday = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

const EmployeeNavbar = () => {
  const { user } = useAuth();
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchLoginHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/login-history/${user._id}`
        );

        const history = res.data.data;

        const grouped = {};
        history.forEach((entry) => {
          const dateOnly = new Date(entry.date).toDateString();
          if (
            !grouped[dateOnly] ||
            new Date(entry.date) > new Date(grouped[dateOnly].date)
          ) {
            grouped[dateOnly] = entry;
          }
        });

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const beforeYesterday = new Date(today);
        beforeYesterday.setDate(today.getDate() - 2);

        const dateList = [beforeYesterday, yesterday, today];

        const final = dateList.map((date) => {
          const dateKey = date.toDateString();
          const match = grouped[dateKey];
          return {
            date,
            status: match ? match.status : "Unknown",
          };
        });

        setDates(final);
        setCurrentMonth(today.toLocaleString("default", { month: "long" }));
      } catch (err) {
        console.error("Failed to fetch login history", err);
      }
    };

    fetchLoginHistory();
  }, [user]);

  return (
    <div className="relative w-full sm:w-51 bg-green-100 rounded-2xl p-4 shadow-md text-center max-h-[95vh] flex flex-col">
      {/* Scrollable Content */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent flex-grow  ">
        {/* Profile */}
        <div className="relative mx-auto w-24 h-24 mb-4 rounded-full shadow-lg overflow-hidden">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-full h-full text-gray-400" />
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-800">{user?.name}</h3>
        <a
          href={`/profile/${user?._id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Profile
        </a>

        {/* Calendar Title */}
        <div className="mt-6 mb-4 text-left">
          <div className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
            <p className="text-gray-800 font-semibold">Calendar</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-medium">{currentMonth}</span>
              <FaCalendarAlt className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* Day Cards */}
        <div className="flex flex-col items-center gap-8 mt-6 mb-6">
          {dates.map(({ date, status }, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-blue-100 w-20 h-20 rounded-xl relative"
              style={{
                boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
              }}
              title={status === "Unknown" ? "Not Updated" : status}
            >
              <span className="text-xl font-extrabold text-gray-900">
                {date.getDate()}
              </span>
              <span className="text-sm text-gray-700">{getWeekday(date)}</span>
              <span
                className={`mt-2 w-3 h-3 rounded-full ${
                  attendanceColors[status] || "bg-gray-400"
                }`}
              ></span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-600"></span> On Time
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span> Half Day
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-600"></span> Absent
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> Late
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-white border border-gray-400"></span>{" "}
            Not Updated
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="absolute bottom-4 right-8 z-50">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300 ${
            settingsOpen ? "rotate-90" : ""
          }`}
        >
          <FaCog className="text-gray-700 text-lg" />
        </button>

        {settingsOpen && (
          <div className="absolute bottom-14 right-0 bg-white shadow-xl rounded-md py-2 px-4 text-left z-50">
            <button
              onClick={() => {
                setSettingsOpen(false);
                alert("Change Password clicked");
              }}
              className="text-sm text-gray-800 hover:text-blue-600 transition"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeNavbar;
