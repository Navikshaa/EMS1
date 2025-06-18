import React, { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns } from "../../../../utils/HrEmployeeHelper";
import headerImage from "../../../../assets/images/AddEmployeehr.png";
import AddEmployeeModal from "./AddEmployeeModal";

const EmList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);

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
            status: emp.status || "N/A",
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

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    if (status === "All") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (emp) => emp.status?.toLowerCase() === status.toLowerCase()
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleDepartmentFilter = (dep) => {
    setActiveDepartment(dep);
    setShowFilters(false);
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
      <div className="relative w-full rounded-b-lg overflow-hidden shadow-lg mb-3">
        <img
          src={headerImage}
          alt="header"
          className="w-full h-52 object-cover"
        />
        <button
          onClick={() => window.history.back()}
          className="absolute top-3 left-3 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow text-2xl"
        >
          ←
        </button>
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-1 bg-white rounded-3xl font-bold text-black hover:bg-gray-200 shadow"
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* 🔘 Status Filter + Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3 font-bold px-5">
        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Inactive", "Terminated"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-5 py-1 rounded shadow-lg ${
                activeStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              } hover:bg-blue-500 hover:text-white transition`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* 🔍 Search + 🧰 Filter */}
        <div className="flex items-center gap-3 relative">
          <input
            type="text"
            placeholder="Search Employee..."
            onChange={handleSearch}
            className="px-4 py-1 border rounded shadow-lg"
          />
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {showFilters && (
              <div className="absolute top-10 right-0 bg-gray-100 rounded-lg shadow-lg px-6 py-4 z-50 w-48">
                <div className="text-center font-bold text-black mb-3">
                  FILTER
                </div>
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
                      activeDepartment === label
                        ? "text-blue-700"
                        : "text-black"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

      {/* 🔽 Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default EmList;
