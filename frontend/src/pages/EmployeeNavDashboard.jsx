import React from "react";
import EmployeeNavdashboard from "../components/EmployeeDashboard/EmployeeDashboard.jsx";
import Navbar from "../components/EmployeeDashboard/EmployeeNavibar.jsx";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Main scrollable area */}
      <div className="w-full pr-64 h-full overflow-y-auto hide-scrollbar">
        <div className="max-w-[calc(103%-0rem)] mx-auto px-6 py-8">
          <EmployeeNavdashboard />
          <Outlet />
        </div>
      </div>

      {/* Fixed Navbar on the right */}
      <div className="w-48 h-screen fixed right-0 top-0 bg-gray-100 shadow-md z-10">
        <Navbar />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
