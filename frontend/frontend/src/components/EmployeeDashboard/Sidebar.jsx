import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  FaChartLine,
  FaIdBadge,
  FaBullhorn,
  FaUmbrellaBeach,
  FaHandHoldingUsd,
  FaClock,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";

import Logo from "../../assets/images/erplogo.png"; // 👈 Replace with actual logo path

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { to: "/employee-dashboard", label: "Dashboard", exact: true },
    { to: `/employee-dashboard/profile/${user?._id}`, label: "My Profile" },
    { to: `/employee-dashboard/task/user/${user?._id}`, label: "Task" },

    { to: `/employee-dashboard/add-leave/${user?._id}`, label: "Leaves" },
    { to: `/employee-dashboard/groups`, label: "Group Chat" },

    { to: `/employee-dashboard/salary/${user?._id}`, label: "Salary" },
    {
      to: `/employee-dashboard/login-history/${user?._id}`,
      label: "Attendance",
    },
    { to: `/employee-dashboard/teams/user/${user?._id}`, label: "Team" },
  ];

  return (
    <aside className="bg-white text-black h-screen fixed left-0 top-0 w-64 shadow-md flex flex-col justify-between">
      {/* Logo + Name */}
      <div className="flex items-center justify-center gap-3 py-6 px-4">
        <img src={Logo} alt="Logo" className="w-28 h-28 object-contain" />
        <h1 className="text-xl font-semibold tracking-wide text-blue-900">
          NAVHIVE
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center space-y-1 px-2">
        {navItems.map(({ to, icon, label, exact }) => (
          <NavLink
            to={to}
            key={label}
            end={exact}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 py-2 px-6 rounded font-medium justify-center text-sm tracking-wide
              ${
                isActive
                  ? "bg-blue-100 text-blue-900 border-r-4 border-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              } transition duration-200`
            }
          >
            {icon}
            <span className="uppercase">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="flex justify-center pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="uppercase font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
