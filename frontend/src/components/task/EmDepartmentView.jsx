import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import EmDptTaskList from "./EmDptTaskList";
import API_ENDPOINTS from "../../config/api";

const EmDepartmentView = () => {
  const { user, loading } = useAuth();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!loading && user) {
        console.log("User from context:", user);
        try {
          const response = await axios.get(
            `${API_ENDPOINTS.EMPLOYEE.BASE}/get-department/${user._id}`
          );
          console.log("Department API response:", response.data);
          setDepartment(response.data.department);
        } catch (error) {
          console.error("Failed to fetch department:", error);
        }
      }
    };

    fetchDepartment();
  }, [user, loading]);

  if (loading) return <div>Loading user info...</div>;

  return (
    <div>
      {department ? (
        <EmDptTaskList departmentId={department._id} />
      ) : (
        <div>Loading department info...</div>
      )}
    </div>
  );
};

export default EmDepartmentView;
