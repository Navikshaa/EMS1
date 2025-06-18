import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaUserCircle, FaPlaneDeparture } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// 🔘 Action Buttons (Salary button removed)
export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();
  const buttonBaseClasses =
    "flex items-center justify-center gap-1 border border-gray-400 text-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-100 transition-all w-[100px]";

  return (
    <div className="flex gap-2 justify-center">
      <button
        title="View"
        className={buttonBaseClasses}
        onClick={() => navigate(`/employee-dashboard/employees/${Id}`)}
      >
        <FaEye />
        View
      </button>
      <button
        title="Edit"
        className={buttonBaseClasses}
        onClick={() => navigate(`/employee-dashboard/employees/edit/${Id}`)}
      >
        <FaEdit />
        Edit
      </button>
      <button
        title="Leave"
        className={buttonBaseClasses}
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
      >
        <FaPlaneDeparture />
        Leave
      </button>
    </div>
  );
};

// 📊 Table Columns
export const columns = [
  {
    name: "Image",
    cell: (row) =>
      row.profileImage ? (
        <img
          src={`http://localhost:3000/uploads/${row.profileImage}`}
          alt={row.name}
          className="w-10 h-10 rounded-full border shadow-sm object-cover"
        />
      ) : (
        <FaUserCircle className="text-gray-400 text-3xl bg-slate-100 rounded-full p-1" />
      ),
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => (
      <span className="text-lg font-semibold text-gray-800">{row.name}</span>
    ),
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => (
      <span className="text-sm font-medium text-indigo-700 uppercase tracking-wide">
        {row.dep_name}
      </span>
    ),
  },
  {
    name: "DOJ",
    selector: (row) =>
      new Date(row.doj).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => (
      <span className="text-sm font-medium text-indigo-700 uppercase tracking-wide">
        {row.status === "active" ? (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Inactive
          </span>
        )}
      </span>
    ),
  },
  {
    name: "Action",
    cell: (row) => <EmployeeButtons Id={row._id} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "320px", // adjusted from 450px to better fit 3 buttons
  },
];

// Fetch Departments
export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.success ? response.data.departments : [];
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

// Fetch Employees by Department
export const getEmployees = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.success ? response.data.employees : [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

// 🚀 Main Component
export const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(filterText.toLowerCase()) ||
        emp.dep_name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [employees, filterText]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Employee Directory
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or department"
          className="w-full sm:w-72 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployees}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        noDataComponent={
          <div className="py-4 text-gray-500">No employees found.</div>
        }
        progressComponent={
          <div className="py-4 text-gray-500">Loading employees...</div>
        }
        customStyles={{
          table: {
            style: {
              backgroundColor: "#f3f4f6", // gray-100
            },
          },
          headRow: {
            style: {
              backgroundColor: "#f3f4f6",
            },
          },
          headCells: {
            style: {
              fontWeight: "700",
              fontSize: "16px",
              backgroundColor: "#f3f4f6",
              color: "#1e293b", // slate-800
              paddingTop: "8px",
              paddingBottom: "8px",
            },
          },
          rows: {
            style: {
              backgroundColor: "#f3f4f6",
              minHeight: "48px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderBottom: "none",
              boxShadow: "none",
            },
          },
          cells: {
            style: {
              paddingTop: "6px",
              paddingBottom: "6px",
              backgroundColor: "#f3f4f6",
            },
          },
        }}
      />
    </div>
  );
};
