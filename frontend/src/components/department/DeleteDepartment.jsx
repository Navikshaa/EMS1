import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";

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
        await axios.delete(`${API_ENDPOINTS.DEPARTMENT.BASE}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Department deleted successfully");
        navigate("/admin-dashboard/departments");
      } catch (error) {
        alert("Failed to delete department");
      }
    };

    deleteDepartment();
  }, [id, navigate]);

  return null;
};

export default DeleteDepartment;
