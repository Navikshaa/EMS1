import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmDptTaskList = ({ departmentId }) => {
  const [departments, setDepartments] = useState([]);
  const [salesDepId, setSalesDepId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/department", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const deps = data.departments || [];
        setDepartments(deps);

        // Find Sales department ID (optional if needed later)
        const salesDep = deps.find((dep) => dep.dep_name === "Sales");
        if (salesDep) setSalesDepId(salesDep._id);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-2 bg-gray-50 min-h-screen">
      {/* Top Banner Image */}
      <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg mb-10">
        <img
          src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/6XgheC4PDL8GGnAAVYJ2ab/01c613d21fe5b79bf7311c68456af2e2/iStock-926151548.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000"
          alt="Departments"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Departments
      </h2>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {departments.map((dep) => {
          const isActive = dep._id === departmentId;

          const handleClick = () => {
            if (!isActive) return;

            if (dep.dep_name.toLowerCase() === "hr") {
              navigate("/employee-dashboard/tasks/hr/task");
            } else {
              navigate(`/employee-dashboard/tasks/department/${dep._id}`);
            }
          };

          return (
            <div
              key={dep._id}
              onClick={handleClick}
              className={`rounded-xl p-6 text-center font-semibold text-lg transition-all duration-300 shadow-md border ${
                isActive
                  ? "bg-blue-100 text-blue-900 hover:shadow-xl cursor-pointer scale-105"
                  : "bg-white text-gray-700 opacity-80 cursor-not-allowed hover:bg-red-100"
              }`}
            >
              {dep.dep_name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmDptTaskList;
