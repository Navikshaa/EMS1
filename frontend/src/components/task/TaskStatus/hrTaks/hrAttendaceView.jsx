import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
const AttendanceUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/login-history");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        if (isMounted) setUsers(data.data || []);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleView = (userId) => {
    navigate(`/employee-dashboard/hr/attendance/${userId}`);
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading users...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-6">Error: {error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        Attendance User List
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Employee ID
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Department
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.employeeId || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.employeeId?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.department || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(user.userId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceUserList;
