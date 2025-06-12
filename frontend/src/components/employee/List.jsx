import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Filter } from "lucide-react";
import DataTable from "react-data-table-component";
import { columns } from "../../utils/EmployeeHelper";
import headerImage from "../../assets/images/AddEmployeehr.png";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [showPathOptions, setShowPathOptions] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const mapped = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            profileImage: emp.userId?.profileImage || null,
            empId: emp.userId?.empId || "N/A",
            name: emp.userId?.name || "N/A",
            doj: emp.doj,
            dep_name: emp.department?.dep_name || "N/A",
          }));
          setEmployees(mapped);
          setFilteredEmployees(mapped);
        }
      } catch (err) {
        alert(err?.response?.data?.error || "Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const result = employees.filter((emp) =>
      emp.name.toLowerCase().includes(value)
    );
    setFilteredEmployees(result);
  };

  const handleDepartmentFilter = (dep) => {
    setActiveDepartment(dep);
    setShowFilters(false); // auto-close
    if (dep === "ALL") {
      setFilteredEmployees(employees);
    } else {
      const result = employees.filter(
        (emp) => emp.dep_name.toLowerCase() === dep.toLowerCase()
      );
      setFilteredEmployees(result);
    }
  };

  return (
    <div className="relative">
      {/* 🔷 Header Image */}
      <div className="relative w-full rounded-b-lg overflow-hidden shadow-md mb-2">
        <img src={headerImage} alt="header" className="w-full h-52 object-cover" />
        <button
          onClick={() => window.history.back()}
          className="absolute top-3 left-3 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow text-2xl"
        >
          ←
        </button>
        <div className="absolute top-3 right-3">
  <button
    onClick={() => setShowPathOptions(!showPathOptions)}
    className="px-8 py-1 bg-white rounded-3xl font-bold text-black hover:bg-gray-200 shadow"
  >
    + Add Employee
  </button>

  {showPathOptions && (
    <div className="mt-2 absolute right-0 bg-white shadow-lg rounded-md z-50">
      <Link
        to="/admin-dashboard/add-employee"
        className="block px-4 py-2 hover:bg-gray-100"
      >
        Admin
      </Link>
      <Link
        to="/employee-dashboard/task/hr/add"
        className="block px-4 py-2 hover:bg-gray-100"
      >
        HR
      </Link>
    </div>
  )}
</div>
      </div>

      {/* 🧰 Filter Button */}
      <div className="flex justify-end font-bold items-center mb-3 right-4 relative">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-700"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>

        {/* 📦 Dropdown Filter Box */}
        {showFilters && (
          <div className="absolute top-10 right-0 bg-gray-100 rounded-lg shadow-lg px-6 py-4 z-50 w-48">
            <div className="text-center font-bold text-black mb-3">FILTER</div>
            {[
              "IT",
              "HR",
              "Sales",
              "Marketing",
              "Compliance",
              "Finance",
              "Operations",
              "ALL",
            ].map((label) => (
              <div
                key={label}
                onClick={() => handleDepartmentFilter(label)}
                className={`cursor-pointer font-semibold py-1 rounded hover:text-blue-700 ${
                  activeDepartment === label ? "text-blue-700" : "text-black"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔍 Search Input */}
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search Employee..."
          onChange={handleSearch}
          className="px-4 py-1 border rounded shadow-sm"
        />
      </div>

      {/* 📋 DataTable */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent={<div className="py-4">No employees found.</div>}
        progressComponent={<div className="py-4">Loading employees...</div>}
      />
    </div>
  );
};

export default List;
