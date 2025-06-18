// AdminSummary.jsx
import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard.jsx";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import axios from "axios";
import DepartmentSalaryChart from "./DepartmentSalaryChart.jsx";
import DepartmentWiseAttendance from "./AttendanceSummary.jsx";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const [deptSalaryData, setDeptSalaryData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/dashboard/summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    const fetchDepartmentSalaryData = async () => {
      try {
        const query =
          `year=${selectedYear}` +
          (selectedMonth ? `&month=${selectedMonth}` : "");
        const res = await axios.get(
          `http://localhost:3000/api/salary/department-salary?${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setDeptSalaryData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch department salary data", error);
      }
    };

    if (token) {
      fetchSummary();
      fetchDepartmentSalaryData();
    }
  }, [selectedYear, selectedMonth, token]);

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Admin Header */}
      <div className="flex items-center space-x-3 mb-6">
        <FaUserShield className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Overview Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Organization Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SummaryCard
            icon={<FaUsers />}
            text="Total Employees"
            number={summary.totalEmployees}
            color="bg-teal-600"
          />
          <SummaryCard
            icon={<FaBuilding />}
            text="Total Departments"
            number={summary.totalDepartments}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaMoneyBillWave />}
            text="Total Salary"
            number={summary.totalSalary}
            color="bg-indigo-600"
          />
        </div>
      </section>

      {/* Leave Summary Section */}
      <section className="mt-12">
        <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">
          Leave Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={summary.leaveSummary.appliedFor}
            color="bg-blue-600"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaveSummary.approved}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summary.leaveSummary.pending}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaveSummary.rejected}
            color="bg-red-600"
          />
        </div>
      </section>

      {/* Department Salary Chart with Filters */}
      <section className="mt-12">
        <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Department-wise Salary Graph
        </h3>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border rounded-md shadow-sm"
          >
            {[2025, 2024, 2023, 2022].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-md shadow-sm"
          >
            <option value="">All Months</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {deptSalaryData.length > 0 ? (
          <DepartmentSalaryChart data={deptSalaryData} />
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No salary data found for the selected period.
          </p>
        )}
      </section>

      <br />
      <br />

      {/* Attendance */}
      <section>
        <DepartmentWiseAttendance />
      </section>
    </div>
  );
};

export default AdminSummary;
