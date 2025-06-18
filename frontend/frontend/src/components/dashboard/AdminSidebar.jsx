import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { FaSignOutAlt } from "react-icons/fa";

import Logo from "../../assets/images/erplogo.png";

const AdminSidebar = () => {
  const { logout } = useAuth();

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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      to: "/admin-dashboard",
      label: "Dashboard",
      exact: true,
    },
    { to: "/admin-dashboard/employees", label: "Employees" },
    {
      to: "/admin-dashboard/departments",
      label: "Departments",
    },
    { to: "/admin-dashboard/teams", label: "Teams" },

    {
      to: "/admin-dashboard/tasks",
      label: "Task",
    },
    {
      to: "/admin-dashboard/leaves",
      label: "Leaves",
    },
    {
      to: "/admin-dashboard/salary/add",
      label: "Salary",
    },
    {
      to: "/admin-dashboard/groups",
      label: "Chat",
    },
    {
      to: "/admin-dashboard/attendance",
      label: "Attendance",
    },

  ];

  return (
    <aside className="bg-white text-black h-screen fixed left-0 top-0 w-64 shadow-md flex flex-col justify-between">
      {/* Logo + Name (Side by side) */}
      <div className="flex items-center justify-center gap-3 py-6 px-4">
        <img src={Logo} alt="Logo" className="w-28 h-28 object-contain" />
        <h1 className="text-xl font-semibold tracking-wide text-blue-900">
          NAVHIVE
        </h1>
      </div>

      {/* Nav Items */}
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

      {/* Logout */}
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

export default AdminSidebar;
