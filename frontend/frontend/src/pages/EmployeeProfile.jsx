import React from "react";
import EmployeeNavdashboard from "../components/employee/View.jsx"; 
import Navbar from "../components/employee/EmployeeSide.jsx";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Fixed Navbar on the left */}
      <div
        className="h-screen fixed top-0 bg-gray-100 mt-6 shadow-md z-10"
        style={{ width: "290px", left: "270px" }}
      >
        <Navbar />
      </div>

      {/* Main scrollable area on the right */}
      <div className="w-full ml-64 h-full overflow-y-auto hide-scrollbar">
        <div className="max-w-[calc(100%-0rem)] mx-auto px-12 ">
          <EmployeeNavdashboard />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
