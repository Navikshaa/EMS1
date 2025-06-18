import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Rolelist = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentRoles = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch department info
        const depRes = await fetch(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const depData = await depRes.json();
        setDepartment(depData.department);

        // Fetch roles grouped by role
        const roleRes = await fetch(
          `http://localhost:3000/api/employee/users/roles/department/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const roleData = await roleRes.json();
        setRoles(roleData.roles || {});
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to load department roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentRoles();
  }, [id]);

  const handleCardClick = (roleName) => {
    navigate(`/admin-dashboard/tasks/subDepartment/${id}?role=${roleName}`);
  };
  

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      {loading ? (
        <p className="text-center">Loading department roles...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Department Name */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md px-4 py-2 text-center w-64">
              <h2 className="text-lg font-semibold text-gray-800">
                {department?.dep_name}
              </h2>
            </div>
          </div>

          {/* Roles Section */}
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(roles).length === 0 ? (
              <p className="text-gray-600">
                No roles found in this department.
              </p>
            ) : (
              Object.entries(roles).map(([roleName, users]) => (
                <div
                  key={roleName}
                  onClick={() => handleCardClick(roleName)}
                  className="bg-white px-6 py-4 rounded-xl shadow hover:bg-blue-100 hover:shadow-lg transform transition-all duration-300 w-52 text-center cursor-pointer"
                >
                  <h3 className="text-md font-semibold text-blue-600 capitalize">
                    {roleName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {users.length} user(s)
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Rolelist;
