import React from "react";
import { useNavigate } from "react-router-dom";
import HrLogo from "../../../assets/images/HrLogo1.png";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center">
      <div className="w-full relative h-60 flex justify-center items-center">
        <img
          src={HrLogo}
          alt="hr logo"
          className="w-full h-60 object-cover z-10 rounded-b-3xl"
        />
      </div>

      <div className="w-full max-w-5xl mt-20 px-10">
        <div className="flex justify-between mb-16">
          <button
            className="w-64 h-20 rounded-3xl bg-white hover:bg-blue-200 shadow-xl font-bold text-gray-700 text-lg"
            onClick={() =>
              navigate("/employee-dashboard/tasks/hr/task/Onboarding")
            }
          >
            ON <br /> BOARDING
          </button>
          <button
            className="w-64 h-20 rounded-3xl bg-white shadow-xl hover:bg-blue-200 font-bold text-gray-700 text-lg"
            onClick={() => navigate("/employee-dashboard/task/employees")}
          >
            ADD <br /> EMPLOYEE
          </button>
        </div>

        <div className="flex justify-between px-16">
          <button
            className="w-64 h-20 rounded-3xl bg-white shadow-xl hover:bg-blue-200 font-bold text-gray-700 text-lg"
            onClick={() => navigate("/employee-dashboard/hr/attendance")}
          >
            ATTENDANCE
          </button>
          <button
            className="w-64 h-20 rounded-3xl bg-white shadow-xl hover:bg-blue-200 font-bold text-gray-700 text-lg"
            onClick={() => navigate("/employee-dashboard/leaves")}
          >
            LEAVES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
