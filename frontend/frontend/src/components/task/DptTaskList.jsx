import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DptTaskList = () => {
  const [departments, setDepartments] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
        setDepartments(data.departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleCardClick = (depId) => {
    navigate(`/admin-dashboard/tasks/department/${depId}`);
  };

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Departments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {departments.map((dep, index) => (
          <div
            key={dep._id}
            onClick={() => handleCardClick(dep._id)}
            className={`bg-white rounded-xl shadow-md p-4 text-center transition-all duration-300 cursor-pointer ${
              hoveredIndex === index ? "bg-blue-100 scale-105 shadow-lg" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <h3 className="text-lg font-semibold">{dep.dep_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DptTaskList;
