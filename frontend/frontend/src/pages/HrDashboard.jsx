import React from "react";
import { useAuth } from "../context/authContext.jsx";
import HrSidebar from "../components/HrDashboard/HrSidebar.jsx";
import Navbar from "../components/dashboard/Navbar.jsx";
import { Outlet } from "react-router-dom";

const HrDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="flex">
      <HrSidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <Navbar />

        <Outlet />
      </div>
    </div>
  );
};

export default HrDashboard;
