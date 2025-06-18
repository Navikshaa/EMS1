import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext.jsx";
import { FaUserShield, FaSignOutAlt, FaBell } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-GB", { hour12: false })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

 

  const dashboardTitle =
    user?.role === "admin"
      ? "Admin Dashboard"
      : user?.role === "employee"
      ? "Employee Dashboard"
      : "Dashboard";

  return (
    <header className="flex items-center justify-between bg-blue-800 text-white px-6 py-3 shadow-md">
      {/* Left: Icon & Title */}
      <div className="flex items-center space-x-3">
        <FaUserShield className="text-2xl text-white" />
        <h1 className="text-xl font-bold tracking-wide">{dashboardTitle}</h1>
      </div>

      {/* Right: Time, Welcome, Bell, Logout */}
      <div className="flex items-center space-x-4">
        <p className="text-sm">{time}</p>
        <FaBell className="text-white text-lg" />

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <p className="text-sm">
            Welcome, <span className="font-medium">{user?.name || "User"}</span>
          </p>
        </div>

        
      </div>
    </header>
  );
};

export default Navbar;
