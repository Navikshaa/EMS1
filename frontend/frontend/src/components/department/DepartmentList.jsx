import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/department/with-count",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            employeeCount: dep.employeeCount || 0,
            actions: <DepartmentButtons _id={dep._id} />,
          }));

          setDepartments(data);
          setFilteredDepartments(data);
        }
      } catch (error) {
        alert("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchTerm)
    );
    setFilteredDepartments(filtered);
  };

  return (
    <div className="p-5">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Department</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Department"
          className="px-4 py-0.5 border border-gray-300 rounded shadow-sm"
          onChange={handleFilter}
        />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={filteredDepartments}
          pagination
          persistTableHead
        />
      </div>
    </div>
  );
};

export default DepartmentList;
