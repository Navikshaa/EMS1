import React, { useEffect, useState } from "react";

const MarketModalContent = ({
  subDepartments = [],
  selectedSubDep,
  setSelectedSubDep,
  employees = [],
  selectedEmployee,
  setSelectedEmployee,
  onSubmit,
}) => {
  const [targetNumber, setTargetNumber] = useState("");
  const [totalPoints, setTotalPoints] = useState("");

  useEffect(() => {
    console.log("Sub-departments:", subDepartments);
  }, [subDepartments]);

  useEffect(() => {
    console.log("Selected Sub-department:", selectedSubDep);
  }, [selectedSubDep]);

  useEffect(() => {
    console.log("Employees list updated:", employees);
  }, [employees]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSubDep || !selectedEmployee || !targetNumber || !totalPoints) {
      alert("Please fill all fields");
      return;
    }

    const employeeName =
      employees.find((emp) => emp._id === selectedEmployee)?.name ||
      employees.find((emp) => emp._id === selectedEmployee)?.userId?.name ||
      "";

    if (onSubmit) {
      onSubmit({
        subDepartment: selectedSubDep,
        employeeName,
        targetNumber,
        total_points: Number(totalPoints),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h3 className="text-xl font-semibold text-center mb-4">
        Create Market Task
      </h3>

      <div className="flex justify-between gap-4 mb-4">
        {/* Sub-department dropdown */}
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">
            Sub-department
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedSubDep}
            onChange={(e) => {
              setSelectedSubDep(e.target.value);
              setSelectedEmployee("");
            }}
          >
            <option value="">Select Sub-department</option>
            {subDepartments.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Employee dropdown */}
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium">Employee</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name || emp.userId?.name || "Unnamed"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Number input */}
      <label className="block mb-2 font-medium" htmlFor="targetNumber">
        Target Number
      </label>
      <input
        id="targetNumber"
        type="text"
        value={targetNumber}
        onChange={(e) => setTargetNumber(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter target number"
        required
      />

      {/* Total Points input */}
      <label className="block mb-2 font-medium" htmlFor="totalPoints">
        Total Points
      </label>
      <input
        id="totalPoints"
        type="number"
        value={totalPoints}
        onChange={(e) => setTotalPoints(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter total points"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default MarketModalContent;
