import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from  'react-data-table-component'
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]) 

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/department", {
                    headers: {
                        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.success) {
                    let sno = 1;
                    const data = response.data.departments.map((dep) => ({
                        _id: dep._id,
                        sno: sno++,
                        dep_name: dep.dep_name,
                        description: dep.description,
                        actions: <DepartmentButtons _id={dep._id}/>,
                    }))
                    setDepartments(data)
                }              
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    };

    fetchDepartments()
}, []);

  return (
    <div className="p-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Department</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Department"
          className="px-4 py-0.5 border border-gray-300 rounded shadow-sm"
        />
        <Link
          to="/admin-dashboard/add-department"
          className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-800 text-white shadow-lg"
        >
          Add Department
        </Link>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={departments} 
        />
      </div>
    </div>
  );
};

export default DepartmentList;
