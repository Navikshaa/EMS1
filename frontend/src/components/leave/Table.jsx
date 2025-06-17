import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getLeaveColumns, LeaveButtons } from "../../utils/LeaveHelper";
import axios from "axios";
import HeaderImg from "../../assets/images/leave.png";

const Table = () => {
  const [leaves, setLeaves] = useState(null);
  const [filteredLeaves, setFilteredLeaves] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId?.name || "N/A",
          userId: leave.employeeId?.userId?._id || "N/A",
          leaveType: leave.leaveType,
          department: leave.employeeId?.department?.dep_name || "N/A",
          days:
            new Date(leave.endDate).getDate() -
            new Date(leave.startDate).getDate(),
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));

        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchDepartments();
  }, []);

  const filterByInput = (e) => {
    const data = leaves.filter((leave) =>
      leave.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    if (status === "") {
      setFilteredLeaves(leaves);
    } else {
      const data = leaves.filter((leave) =>
        leave.status.toLowerCase().includes(status.toLowerCase())
      );
      setFilteredLeaves(data);
    }
  };

  const filterByDepartment = (dept) => {
    setSelectedDept(dept);
    if (dept === "") {
      setFilteredLeaves(leaves);
    } else {
      const filtered = leaves.filter((leave) =>
        leave.department.toLowerCase().includes(dept.toLowerCase())
      );
      setFilteredLeaves(filtered);
    }
  };

  return (
    <>
      {filteredLeaves ? (
        <div>
          {/* 🔷 Header Image */}
          <div className="w-[1000px] mb-6 rounded-3xl overflow-hidden shadow-md">
            <img
              src={HeaderImg}
              alt="Header"
              className="w-full h-full object-contain "
            />
          </div>
          <button
            onClick={() => window.history.back()}
            className="absolute top-6 left-53 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow text-2xl"
          >
            ←
          </button>

          {/* 🔍 Filters */}
          <div className="text-center p-3">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
              {/* 🔍 Search */}
              <input
                type="text"
                placeholder="Search by name..."
                className="border border-gray-300 rounded px-4 py-2 shadow-lg w-full lg:w-72"
                onChange={filterByInput}
              />

              {/* 🏢 Department Filter */}
              <select
                value={selectedDept}
                onChange={(e) => filterByDepartment(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 shadow-lg w-full lg:w-72"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.dep_name}>
                    {dept.dep_name}
                  </option>
                ))}
              </select>

              {/* 📂 Status Filter Dropdown */}
              <div className="w-full lg:w-64">
                <select
                  id="statusFilter"
                  onChange={(e) => filterByButton(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-lg bg-white text-gray-700"
                >
                  <option value="">-- Select Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* 📋 Leave Table */}
            <DataTable
              columns={getLeaveColumns()}
              data={filteredLeaves}
              pagination
              striped
              highlightOnHover
              responsive
              noDataComponent={
                <div className="py-4 text-gray-500">No leaves found.</div>
              }
            />
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">Loading...</div>
      )}
    </>
  );
};

export default Table;
