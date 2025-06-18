import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ItModalContent = ({
  subDepartments = [],
  selectedSubDep,
  setSelectedSubDep,
  employees = [],
  selectedEmployee,
  setSelectedEmployee,
  taskTitle,
  setTaskTitle,
  message,
  setMessage,
  dateRange,
  setDateRange,
  image,
  setImage,
  handleTaskSubmit,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">Create IT Task</h3>

      {/* Sub-department and Employee Selectors */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sub-department Selector */}
        <div className="flex-1">
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
            <option value="">-- Select Sub-department --</option>
            {subDepartments.length > 0 ? (
              subDepartments.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.name}
                </option>
              ))
            ) : (
              <option disabled>No sub-departments available</option>
            )}
          </select>
        </div>

        {/* Employee Selector */}
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">
            Select Employee
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name || emp.userId?.name || "Unnamed"}
                </option>
              ))
            ) : (
              <option disabled>No employees found</option>
            )}
          </select>
        </div>
      </div>

      {/* Task Title */}
      <div>
        <label className="block mb-1 text-sm font-medium">Task Title</label>
        <input
          type="text"
          maxLength={200}
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title (max 200 characters)"
        />
        <div className="text-sm text-gray-500 text-right">
          {taskTitle.length} / 200
        </div>
      </div>

      {/* Task Message */}
      <div>
        <label className="block mb-1 text-sm font-medium">Task Message</label>
        <textarea
          rows="4"
          maxLength={1000}
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter task description (max 1000 characters)"
        />
        <div className="text-sm text-gray-500 text-right">
          {message.length} / 1000
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex justify-center">
        <Calendar
          selectRange={true}
          onChange={setDateRange}
          value={dateRange}
          className="react-calendar"
        />
      </div>
      {Array.isArray(dateRange) && (
        <div className="text-sm text-gray-700 mt-2 text-center">
          Selected: {dateRange[0].toLocaleDateString()} →{" "}
          {dateRange[1]?.toLocaleDateString()}
        </div>
      )}

      {/* Image Upload + Submit */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/2">
          <label className="block mb-1 text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="w-full md:w-1/2 flex justify-end mt-2 md:mt-0">
          <button
            onClick={handleTaskSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItModalContent;
