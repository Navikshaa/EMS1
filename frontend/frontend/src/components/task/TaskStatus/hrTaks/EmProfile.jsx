import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser } from "react-icons/fa";

const EmProfile = ({ userId }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [avgCheckIn, setAvgCheckIn] = useState("—");
  const [avgCheckOut, setAvgCheckOut] = useState("—");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/employee/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch {
        alert("Failed to load employee details.");
      }
    };

    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/login-history/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const rawData = response.data.data || [];

        const filtered = rawData
          .map((entry) => {
            if (!entry.loginTime || !entry.logoutTime) return null;
            return {
              login: new Date(entry.loginTime),
              logout: new Date(entry.logoutTime),
              status: entry.status?.toLowerCase(),
            };
          })
          .filter(Boolean);

        setAttendanceData(filtered);

        const onTimeCount = filtered.filter((e) =>
          e.status?.includes("on time")
        ).length;
        setTotalAttendance(onTimeCount);

        const avgLogin = averageTime(filtered.map((e) => e.login));
        const avgLogout = averageTime(filtered.map((e) => e.logout));

        setAvgCheckIn(avgLogin);
        setAvgCheckOut(avgLogout);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };

    if (userId) {
      fetchEmployee();
      fetchAttendance();
    }
  }, [userId]);

  const averageTime = (times) => {
    if (!times.length) return "—";
    const total = times.reduce(
      (sum, d) => sum + (d.getHours() * 60 + d.getMinutes()),
      0
    );
    const avg = total / times.length;
    const hours = Math.floor(avg / 60);
    const minutes = Math.round(avg % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };

  if (!employee) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <div className="bg-black text-white rounded-3xl p-6 relative shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaArrowLeft
              className="text-2xl cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-lg font-semibold border-l-4 border-green-500 pl-2">
              EMPLOYEE DETAIL
            </h2>
          </div>
          <button
            onClick={handleDownload}
            className="bg-gray-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm"
          >
            DOWNLOAD
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-wrap md:flex-nowrap items-center mt-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center">
            {employee?.userId?.profileImage ? (
              <img
                src={`http://localhost:3000/uploads/${employee.userId.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-6xl text-gray-500" />
            )}
          </div>

          <div className="ml-6">
            <h3 className="text-2xl font-semibold">{employee.userId.name}</h3>
            <div className="flex flex-wrap gap-16 text-sm text-gray-300 mt-4">
              <p className="uppercase">
                ROLE <span className="font-semibold ml-2">{employee.role}</span>
              </p>
              <p>
                PHONE NUMBER{" "}
                <span className="ml-2 font-semibold">
                  +91 - {employee.phone}
                </span>
              </p>
              <p>
                EMAIL{" "}
                <span className="ml-2 font-semibold">
                  {employee.userId.email}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white text-black rounded-2xl py-4 px-3 flex flex-col items-center shadow-md">
            <p className="text-2xl font-bold">{totalAttendance}</p>
            <p className="text-sm mt-1 text-gray-500">TOTAL ATTENDANCE</p>
          </div>
          <div className="bg-white text-black rounded-2xl py-4 px-3 flex flex-col items-center shadow-md">
            <p className="text-2xl font-bold">{avgCheckIn}</p>
            <p className="text-sm mt-1 text-gray-500">AVG. CHECK IN TIME</p>
          </div>
          <div className="bg-white text-black rounded-2xl py-4 px-3 flex flex-col items-center shadow-md">
            <p className="text-2xl font-bold">{avgCheckOut}</p>
            <p className="text-sm mt-1 text-gray-500">AVG. CHECK OUT TIME</p>
          </div>
          <div className="bg-white text-black rounded-2xl py-4 px-3 flex flex-col items-center shadow-md">
            <p className="text-2xl font-bold">{employee.designation}</p>
            <p className="text-sm mt-1 text-gray-500">DESIGNATION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmProfile;
