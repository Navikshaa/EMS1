import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import EmDptTaskList from "./EmDptTaskList";

const EmDepartmentView = () => {
  const { user, loading } = useAuth();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!loading && user) {
        console.log("User from context:", user);
        try {
          const response = await axios.get(
            `http://localhost:3000/api/employee/get-department/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
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
