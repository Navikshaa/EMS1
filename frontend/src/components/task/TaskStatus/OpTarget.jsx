import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList, // ✅ import LabelList
} from "recharts";
import bgImage from "../../../assets/images/Task_bg.jpeg";

const dayColors = {
  Monday: "#3b82f6",
  Tuesday: "#059669",
  Wednesday: "#f59e0b",
  Thursday: "#ef4444",
  Friday: "#8b5cf6",
  Saturday: "#10b981",
};

const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7)); // Go to Monday
  const result = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    result.push(date);
  }
  return result;
};

const CustomGauge = ({ value }) => {
  const percent = Math.min(Math.max(value, 0), 100);
  const rotation = (percent / 100) * 180;

  return (
    <div className="relative w-64 h-32 mx-auto">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="10"
          strokeDasharray={`${percent * 1.26}, 126`}
        />
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="#9ca3af"
          transform={`rotate(${rotation}, 50, 50) translate(0, -40)`}
        />
      </svg>
      <div className="absolute bottom-0 w-full text-center text-sm font-semibold">
        {percent.toFixed(1)}%
      </div>
    </div>
  );
};

const OpTargetList = () => {
  const [barData, setBarData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [taskCompletedPoints, setTaskCompletedPoints] = useState(0);
  const [taskInProgressPoints, setTaskInProgressPoints] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoadingChart(true);
      try {
        const response = await axios.get("http://localhost:3000/api/salestask");
        const allTasks = response.data || [];

        const doneTasks = allTasks.filter(
          (task) => task.status === "partial_done"
        );
        const pendingTasks = allTasks.filter(
          (task) => task.status === "pending"
        );

        setTaskCompletedPoints(doneTasks.length);
        setTaskInProgressPoints(pendingTasks.length);

        const weekDates = getWeekDates();

        const grouped = weekDates.map((dateObj) => {
          const dateStr = dateObj.toLocaleDateString("en-CA"); // local format YYYY-MM-DD
          const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });

          const countForDay = doneTasks.filter((task) => {
            const taskDate = new Date(task.updatedAt).toLocaleDateString(
              "en-CA"
            );
            return taskDate === dateStr;
          }).length;

          return {
            day,
            taskCount: countForDay,
            color: dayColors[day] || "#ccc",
          };
        });

        setBarData(grouped);
      } catch (err) {
        console.error("Failed to fetch sales tasks:", err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totalPoints = taskCompletedPoints + taskInProgressPoints;
  const progressPercent = totalPoints
    ? (taskCompletedPoints / totalPoints) * 100
    : 0;

  return (
    <div
      className="p-4 rounded-lg shadow-md flex flex-col space-y-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full min-w-0">
        {/* Bar Chart */}
        <div className="w-full md:w-1/3" style={{ height: 150, minWidth: 0 }}>
          <div className="flex flex-wrap justify-start gap-2 mb-2">
            {Object.entries(dayColors).map(([day, color]) => (
              <div key={day} className="flex items-center space-x-1">
                <div
                  style={{
                    backgroundColor: color,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  }}
                />
                <span className="text-xs">{day}</span>
              </div>
            ))}
          </div>

          {loadingChart ? (
            <div>Loading chart...</div>
          ) : (
            <div style={{ width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                >
                  <YAxis
                    tick={true}
                    axisLine={false}
                    tickLine={false}
                    width={20}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="border p-2 text-xs shadow-sm bg-white">
                            <p>
                              <strong>{data.day}</strong>
                            </p>
                            <p>Tasks Completed: {data.taskCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="taskCount"
                    radius={[10, 10, 0, 0]}
                    isAnimationActive={false}
                    label={false} // ✅ disables any label
                  >
                    {barData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Gauge Chart */}
        <div className="w-full md:w-1/3 flex justify-center items-center pt-6">
          <div className="flex flex-col items-center">
            <CustomGauge value={progressPercent} />
            <h1 className="mt-2 text-sm font-medium text-gray-700">
              Successful deals
            </h1>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full md:w-1/3 flex flex-col items-end space-y-4 mt-12">
          <div className="w-full flex flex-col items-end text-right gap-4">
            <div className="flex flex-row gap-12 justify-end w-full">
              <div>
                <p className="text-lg font-bold">{taskInProgressPoints}</p>
                <br />
                <p className="text-sm text-gray-500">Task In Progress</p>
              </div>
              <div>
                <p className="text-lg font-bold">{taskCompletedPoints}</p>
                <br />
                <p className="text-sm text-gray-500">Task Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpTargetList;
