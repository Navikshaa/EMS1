import React, { useState, useEffect } from "react";
import LeaveSummary from "./LeaveSummary";
import AttendanceSummary from "../attendance/AttendanceSummary";
import { useAuth } from "../../context/authContext";
import Girl from "../../assets/images/Girlimg.png";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const current = new Date();
      setTime(current);
      const hours = current.getHours();

      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user) return <div>Loading...</div>;

  const formattedTime = time.toLocaleTimeString("en-GB", { hour12: false });

  return (
<div className="max-w-7xl mx-auto px-6 py-2">      {/* Time above greeting box */}
      <div className="text-center text-lg font-semibold text-gray-700 mb-4">
        {formattedTime}
      </div>

      {/* Full-width Greeting Box */}
      <div className="relative bg-blue-500 rounded-3xl p-4 w-full overflow mb-10 min-h-[240px] md:min-h-[280px] lg:min-h-[280px]">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-8">
          {greeting}, {user.name}!
        </h2>
        <p className="text-gray-700 text-lg mb-12">
          There are several tasks currently pending completion.
        </p>
        <button className="bg-white font-semibold px-6 py-2 rounded-full text-blue-600 hover:bg-gray-100 transition">
          Review it!
        </button>

        {/* Girl image with head outside the box */}
        <img
          src={Girl}
          alt="Employee"
          className="absolute right-2 object-cover"
          style={{
            height: "380px",
            top: "-100px", // moves head out of the box
            transform: "translateX(30%)",
          }}
        />
      </div>

      {/* Leave Summary */}
      <LeaveSummary userId={user._id} />
      <br />

      {/* Attendance Summary */}
      <div className="mt-12">
        <AttendanceSummary userId={user._id} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
