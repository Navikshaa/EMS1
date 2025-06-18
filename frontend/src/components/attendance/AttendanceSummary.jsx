import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaClock,
  FaTimesCircle,
  FaHourglassHalf,
  FaSignInAlt,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import API_ENDPOINTS from "../../config/api";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const AttendanceSummary = ({ userId }) => {
  const [summary, setSummary] = useState({
    onTime: 0,
    halfDays: 0,
    absent: 0,
    lateLogin: 0,
    presentDays: 0,
  });

  const [attendanceArray, setAttendanceArray] = useState([]);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  const monthNames = [
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
  ];

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_ENDPOINTS.ADMIN_EDIT.BASE}/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rawData = response.data?.data || [];
      console.log("📦 Raw attendance data from API:", rawData);

      const normalizedData = rawData.map((entry) => ({
        ...entry,
        status: entry.status?.trim().toLowerCase(),
      }));

      setAttendanceArray(normalizedData);
    } catch (err) {
      console.error("❌ Error fetching attendance data:", err);
      setError("Failed to fetch attendance summary");
    }
  };

  useEffect(() => {
  if (!userId) return;

  fetchAttendance(); // initial call

  const interval = setInterval(() => {
    const newDate = new Date().toDateString();
    if (newDate !== currentDate) {
      setCurrentDate(newDate);
      fetchAttendance();
    }
  }, 30 * 60 * 1000);

  return () => clearInterval(interval);
}, [userId]);


  useEffect(() => {
    const validStatuses = [
      "on time",
      "late",
      "late login",
      "half day",
      "absent",
    ];
    const statusPriority = {
      "on time": 1,
      late: 2,
      "late login": 2,
      "half day": 3,
      absent: 4,
    };

    const filtered = attendanceArray.filter((entry) => {
      if (!entry.date || !entry.status) return false;
      const date = new Date(entry.date);
      const yearMatch = date.getFullYear() === selectedYear;
      const monthMatch = selectedMonth
        ? date.getMonth() + 1 === parseInt(selectedMonth)
        : true;

      const isValid = validStatuses.includes(entry.status);
      if (!isValid) console.warn("❗ Unknown status ignored:", entry.status);

      return yearMatch && monthMatch && isValid;
    });

    const normalizedByDate = {};
    filtered.forEach((entry) => {
      const dateKey = new Date(entry.date).toDateString();
      const current = normalizedByDate[dateKey];
      if (
        !current ||
        statusPriority[entry.status] < statusPriority[current.status]
      ) {
        normalizedByDate[dateKey] = entry;
      }
    });

    const uniqueEntries = Object.values(normalizedByDate);
    console.log("🎯 Normalized attendance entries:", uniqueEntries);

    let onTime = 0,
      halfDays = 0,
      absent = 0,
      lateLogin = 0,
      presentDays = 0;

    uniqueEntries.forEach((entry) => {
      const status = entry.status;
      switch (status) {
        case "on time":
          onTime++;
          presentDays++;
          break;
        case "late":
        case "late login":
          lateLogin++;
          presentDays++;
          break;
        case "half day":
          halfDays++;
          presentDays++;
          break;
        case "absent":
          absent++;
          break;
        default:
          break;
      }
    });

    setSummary({ onTime, halfDays, absent, lateLogin, presentDays });
  }, [attendanceArray, selectedYear, selectedMonth]);

  const chartLabels = ["On Time", "Half Day", "Absent", "Late Login"];
  const chartData = [
    summary.onTime,
    summary.halfDays,
    summary.absent,
    summary.lateLogin,
  ];
  const chartColors = ["#16a34a", "#ec4899", "#dc2626", "#f97316"];
  const total = chartData.reduce((acc, val) => acc + val, 0);
  const safeChartData = chartData.map((val) => (val === 0 ? 0.00001 : val));

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-full min-h-screen px-3 sm:px-4 bg-gray-100">
      <div className="max-w-[100%] mx-auto">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Present Days"
            number={summary.presentDays}
            color="bg-blue-600"
          />
          <SummaryCard
            icon={<FaClock />}
            text="On Time"
            number={summary.onTime}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Half Days"
            number={summary.halfDays}
            color="bg-pink-500"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Absent"
            number={summary.absent}
            color="bg-red-600"
          />
          <SummaryCard
            icon={<FaSignInAlt />}
            text="Late Login"
            number={summary.lateLogin}
            color="bg-orange-500"
          />
        </div>

        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-2">
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
            {monthNames.map((month, i) => (
              <option key={i + 1} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Doughnut Chart */}
       
        <div className="bg-white rounded-lg p-6 shadow-md w-full h-[480px] flex flex-col items-center gap-12">
          <div className="w-full max-w-md h-[410px]">
            <Doughnut
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    data: safeChartData,
                    backgroundColor: chartColors,
                    borderWidth: 2,
                    cutout: "60%",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      pointStyle: "circle",
                      padding: 12,
                      font: { size: 14 },
                    },
                  },
                  datalabels: {
                    color: "#000",
                    formatter: (value, context) => {
                      const total = context.chart.data.datasets[0].data.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percent = (value / total) * 100;
                      return percent > 0.5 ? `${percent.toFixed(1)}%` : "";
                    },
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    anchor: "center",
                    align: "center",
                    clamp: true,
                  },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
