import React, { useEffect, useState } from "react";
import axios from "axios";
import AddSalesForm from "./SalesTask";
import {
  BarChart,
  Bar,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
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

const programPointsMap = {
  "Autonomous Learning": 1,
  "Mentor Sync": 4,
  Accelerator: 6,
};

const MarketTargetList = ({ employeeName }) => {
  const [targets, setTargets] = useState([]);
  const [loadingTargets, setLoadingTargets] = useState(true);
  const [barData, setBarData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [taskCompletedPoints, setTaskCompletedPoints] = useState(0);
  const [totalTicketSize, setTotalTicketSize] = useState(0);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/targets");
        setTargets(response.data);
      } catch (error) {
        console.error("Error fetching targets:", error);
      } finally {
        setLoadingTargets(false);
      }
    };

    fetchTargets();
  }, []); // Run only once to avoid loops

  useEffect(() => {
    const fetchSalesAndAggregate = async () => {
      if (!employeeName) return;
      setLoadingChart(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/salestask/marketed-from/${employeeName}`
        );
        const allTasks = response.data || [];

        // Calculate taskCompletedPoints based on program_type
        const completedPoints = allTasks.reduce((sum, task) => {
          const type = task.program_type;
          return sum + (programPointsMap[type] || 0);
        }, 0);
        setTaskCompletedPoints(completedPoints);

        const sortedTasks = [...allTasks].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyTasks = sortedTasks.filter(
          (task) =>
            new Date(task.createdAt).toISOString().slice(0, 7) === currentMonth
        );

        const total = monthlyTasks.reduce(
          (sum, t) => sum + (t.ticket_size || 0),
          0
        );
        setTotalTicketSize(total);

        const weekDates = getWeekDates();
        const grouped = weekDates.map((dateObj) => {
          const dateStr = dateObj.toLocaleDateString("en-CA");
          const day = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
          });

          const tasksForDay = monthlyTasks.filter((task) => {
            const taskDate = new Date(task.createdAt).toLocaleDateString(
              "en-CA"
            );
            return taskDate === dateStr;
          });

          const totalTicketSize = tasksForDay.reduce(
            (sum, task) => sum + (task.ticket_size || 0),
            0
          );

          return {
            day,
            taskCount: tasksForDay.length,
            totalTicketSize,
            color: dayColors[day],
          };
        });

        setBarData(grouped);
      } catch (err) {
        console.error("Failed to fetch sales tasks:", err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchSalesAndAggregate();

    const interval = setInterval(() => {
      fetchSalesAndAggregate();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [employeeName]);

  if (loadingTargets) return <div className="p-4">Loading targets...</div>;

  // Calculate total points from targets for the current month and employee
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTargets = targets.filter(
    (t) =>
      t.createdAt.slice(0, 7) === currentMonth &&
      t.employeeName === employeeName
  );

  const totalPoints = monthlyTargets.reduce(
    (sum, t) => sum + Number(t.total_points || 0),
    0
  );

  // Calculate progress percent for the gauge (taskCompletedPoints / totalPoints * 100)
  const progressPercent =
    totalPoints > 0 ? (taskCompletedPoints / totalPoints) * 100 : 0;

  return (
    <div
      className="p-4 rounded-lg shadow-md flex flex-col space-y-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-53 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow text-2xl"
      >
        ←
      </button>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full min-w-0">
        {/* Bar Chart */}

        <div className="w-full md:w-1/3" style={{ height: 220, minWidth: 0 }}>
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
            <div style={{ width: "100%", height: "calc(100% - 30px)" }}>
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
                          <div className=" border p-2 text-xs shadow-sm">
                            <p>
                              <strong>{data.day}</strong>
                            </p>
                            <p>Tasks: {data.taskCount}</p>
                            <p>Total Ticket Size: ₹{data.totalTicketSize}</p>
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
        <div
          className="w-full md:w-1/3 flex justify-center items-center pt-6"
          style={{ minWidth: 0 }}
        >
          <div className="flex flex-col items-center">
            <CustomGauge value={progressPercent} />
            <h1 className="mt-2 text-sm font-medium text-gray-700">
              Successful deals
            </h1>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="w-full md:w-1/3 flex flex-col items-end space-y-4 mt-12"
          style={{ minWidth: 0 }}
        >
          <div className="w-full flex flex-col items-end text-right gap-4">
            {targets.length === 0 ? (
              <div>No targets found.</div>
            ) : (
              (() => (
                <div className="flex flex-row gap-12 justify-end w-full">
                  <div>
                    <p className="text-lg font-bold">
                      {Math.max(totalPoints - taskCompletedPoints, 0)}
                    </p>
                    <br />
                    <p className="text-sm text-gray-500">Task In Progress</p>
                  </div>

                  <div>
                    <p className="text-lg font-bold">{taskCompletedPoints}</p>
                    <br />
                    <p className="text-sm text-gray-500">Task Completed</p>
                  </div>

                  <div>
                    <p className="text-lg font-bold">{totalTicketSize || 0}</p>
                    <br />
                    <p className="text-sm text-gray-500">
                      PrePayment from Customers
                    </p>
                  </div>
                </div>
              ))()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTargetList;
