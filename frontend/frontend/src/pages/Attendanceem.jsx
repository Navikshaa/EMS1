import React from "react";
import EmployeeSideBar from "../components/attendance/EmployeeattendanceProfile.jsx";
import Navbar from "../components/attendance/View.jsx";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
    return (
         <div>
      <EmployeeSideBar />
        <Navbar />
      </div>
    );
} 

export default EmployeeDashboard;