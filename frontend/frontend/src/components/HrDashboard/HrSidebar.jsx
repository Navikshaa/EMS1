import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext.jsx";

const HrSidebar = () => {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700 ${
      isActive ? "bg-teal-500 text-white" : "text-black"
    }`;

  return (
    <div className="bg-white text-black h-screen fixed left-0 top-0 bottom-0 space-y-4 w-64">
      <div className="bg-blue-700 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-white text-center font-bold">
          Employee N-Dash
        </h3>
      </div>

      <div className="px-6 py-4 space-y-2">
        <NavLink to="/hr-dashboard/" className={navLinkClass}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/hr-dashboard/hr-employees" className={navLinkClass}>
          <FaUser />
          <span>Employee</span>
        </NavLink>

        <NavLink to="/hr-dashboard/departments" className={navLinkClass}>
          <FaBuilding />
          <span>Department</span>
        </NavLink>

        <NavLink to="/hr-dashboard/leaves" className={navLinkClass}>
          <FaCalendarAlt />
          <span>Leave</span>
        </NavLink>

        <NavLink to="/hr-dashboard/employee-leaves" className={navLinkClass}>
          <FaCalendarAlt />
          <span>Employee Leave</span>
        </NavLink>

        <NavLink to={`/hr-dashboard/pf/${user?._id}`} className={navLinkClass}>
          <FaUser />
          <span>PF A/C</span>
        </NavLink>

        <NavLink
          to={`/hr-dashboard/login-history/${user?._id}`}
          className={navLinkClass}
        >
          <FaCalendarAlt />
          <span>Attendance </span>
        </NavLink>
      </div>
    </div>
  );
};

export default HrSidebar;
