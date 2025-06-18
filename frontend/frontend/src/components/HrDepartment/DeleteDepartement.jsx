import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DeleteDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasDeleted = useRef(false);

  useEffect(() => {
    if (hasDeleted.current) return;
    hasDeleted.current = true;

    const deleteDepartment = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/department/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Department deleted successfully");
        navigate("/hr-dashboard/departments");
      } catch (error) {
        alert("Failed to delete department");
      }
    };

    deleteDepartment();
  }, [id, navigate]);

  return null;
};

export default DeleteDepartment;
