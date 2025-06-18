import React, { useEffect, useState } from "react";
import axios from "axios";

const UserLeaves = ({ userId }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/leave/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setLeaves(res.data.leaves);
      } else {
        setError("Failed to fetch leaves");
      }
    } catch (err) {
      setError("Error fetching leaves");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchLeaves();
  }, [userId]);

  if (loading) return <div>Loading leave data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (leaves.length === 0) return <div>No leaves found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Leave Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leaves.map((leave) => (
          <div key={leave._id} className="border rounded p-4 shadow">
            <p>
              <strong>Type:</strong> {leave.leaveType}
            </p>
            <p>
              <strong>Status:</strong> {leave.status}
            </p>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(leave.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(leave.endDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserLeaves;
