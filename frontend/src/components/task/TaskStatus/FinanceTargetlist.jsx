import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../../assets/images/Task_bg.jpeg";

const CustomGauge = ({ value, label }) => {
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
        {label}: {percent.toFixed(1)}%
      </div>
    </div>
  );
};

const FinanceTargetList = () => {
  const [creditedCount, setCreditedCount] = useState(0);
  const [defaultCount, setDefaultCount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/salestask");
        const allTasks = response.data || [];

        const credited = allTasks.filter((task) => task.status === "done");
        const defaults = allTasks.filter((task) => task.status === "default");
        const remaining = allTasks.reduce(
          (sum, task) => sum + (parseFloat(task.pending_amount) || 0),
          0
        );

        setCreditedCount(credited.length);
        setDefaultCount(defaults.length);
        setRemainingAmount(remaining);
        setTotalTasks(allTasks.length);
      } catch (err) {
        console.error("Failed to fetch sales tasks:", err);
      }
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const creditedPercent = totalTasks ? (creditedCount / totalTasks) * 100 : 0;
  const defaultPercent = totalTasks ? (defaultCount / totalTasks) * 100 : 0;

  return (
    <div
      className="p-4 rounded-lg shadow-md flex flex-col space-y-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 w-full min-w-0">
        {/* Gauge 1: Credited Sale */}
        <div className="w-full lg:w-1/3 flex justify-center items-center pt-6">
          <div className="flex flex-col items-center">
            <CustomGauge value={creditedPercent} label="Credited Sale" />
            <h1 className="mt-2 text-sm font-medium text-gray-700">
              Successfully Deals
            </h1>
          </div>
        </div>

        {/* Gauge 2: Default Sale */}
        <div className="w-full lg:w-1/3 flex justify-center items-center pt-6">
          <div className="flex flex-col items-center">
            <CustomGauge value={defaultPercent} label="Default Sale" />
            <h1 className="mt-2 text-sm font-medium text-gray-700">
              Default Deals
            </h1>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:w-1/3 flex justify-center items-center pt-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">
            {/* Label Column */}
            <div className="flex flex-col gap-4">
              <div className="bg-blue-100 rounded-lg p-3 shadow">
                <p className="text-sm font-bold text-gray-700">Credited Sale</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 shadow">
                <p className="text-sm font-bold text-gray-700">Default Sale</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 shadow">
                <p className="text-sm font-bold text-gray-700">
                  Remaining Sale
                </p>
              </div>
            </div>

            {/* Value Column */}
            <div className="flex flex-col gap-4 items-end">
              <div className="p-2">
                <p className="text-lg font-bold text-black">{creditedCount}</p>
              </div>
              <div className="p-4">
                <p className="text-lg font-bold text-black">{defaultCount}</p>
              </div>
              <div className="p-4">
                <p className="text-lg font-bold text-black">
                  ₹{remainingAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTargetList;
