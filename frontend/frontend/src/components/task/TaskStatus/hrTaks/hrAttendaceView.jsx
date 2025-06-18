import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceUserList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDep, setSelectedDep] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error("Error fetching departments", err);
      }
    };
    fetchDepartments();
  }, []);

  // 🔹 Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setEmployees(data.employees || []);
      } catch (err) {
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // 🔍 Filtered list
  const filteredEmployees = employees.filter((emp) => {
    const matchesDep = selectedDep
      ? emp.department?.dep_name === selectedDep
      : true;
    const matchesName = emp.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesDep && matchesName;
  });

  const handleView = (userId) => {
    navigate(`/employee-dashboard/hr/attendance/${userId}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-45 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow text-2xl"
      >
        ←
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">
        Attendance User List
      </h2>

      {/* 🔘 Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium">Filter by Department:</label>
          <select
            value={selectedDep}
            onChange={(e) => setSelectedDep(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Departments</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep.dep_name}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* 🔄 Loading/Error */}
      {loading ? (
        <p className="text-center mt-6 text-gray-600">Loading employees...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-6">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                  Employee ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                  Department
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {emp.employeeId || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {emp.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {emp.department?.dep_name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(emp.userId?._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceUserList;
