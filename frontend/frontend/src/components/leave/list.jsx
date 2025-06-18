import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Leave from "../../assets/images/leave.png"
const List = () => {
  const [leaves, setLeaves] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      alert("Error fetching leave data");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Full-width header image */}
      <div className="w-full">
        <img
          src= {Leave}
          alt="Header"
          className="w-full h-45 object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Leave List</h2>
          <p className="text-gray-600">All the leave details of the employee</p>
        </div>

        {user.role === "employee" && (
          <div className="text-right mb-4">
            <Link
              to="/employee-dashboard/add-leave"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Apply Leave
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaves.map((leave, index) => (
            <div
              key={leave._id}
              className="bg-white rounded-xl shadow p-6 space-y-2"
            >
              <div className="text-sm text-gray-500">#{index + 1}</div>
              <div>
                <strong>Leave Type:</strong> {leave.leaveType}
              </div>
              <div>
                <strong>Start Date:</strong>{" "}
                {new Date(leave.startDate).toLocaleDateString()}
              </div>
              <div>
                <strong>End Date:</strong>{" "}
                {new Date(leave.endDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Description:</strong> {leave.reason}
              </div>
              <div>
                <strong>Status:</strong> {leave.status}
              </div>

              {(user.role === "hr" || user.role === "manager") &&
                leave.status === "Pending" && (
                  <button
                    onClick={() =>
                      navigate(`/admin-dashboard/leaves/${leave._id}`)
                    }
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
