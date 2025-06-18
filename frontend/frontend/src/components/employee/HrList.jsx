import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns, EmployeeButtons } from "../../utils/HrEmployeeHelper";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            profileImage: emp.userId.profileImage,
            empId: emp.userId.empId,
            name: emp.userId.name,
            doj: new Date(emp.doj).toDateString(),
            dep_name: emp.department?.dep_name || "N/A",
            actions: <EmployeeButtons Id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || "Failed to fetch employee data.";
        alert(message);
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(keyword)
    );
    setFilteredEmployees(records);
  };

  return (
    <div className="p-4 shadow-md rounded-lg">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Employee"
          className="px-4 py-1 border border-gray-300 rounded shadow-sm"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-800 text-white shadow-lg"
        >
          Add Employee
        </Link>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={filteredEmployee}
          pagination
          progressPending={empLoading}
          persistTableHead
        />
      </div>
    </div>
  );
};

export default List;
