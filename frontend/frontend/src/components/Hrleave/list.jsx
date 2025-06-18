import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const List = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  let sno = 1;

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/leave/${user._id}`,
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
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="p-6">
      <div className="text-center">
        <h4 className="text-2xl font-bold">Leave List</h4>
        <p className="text-gray-500">All the leave details of the employee</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <label htmlFor="search" className="mr-2">
            Search:
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <Link
          to="/hr-dashboard/add-leave"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Leave
        </Link>
      </div>

      <table className="min-w-full mt-4 border border-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-300 border-b">
          <tr>
            <th className="border border-gray-300 px-6 py-3">SNo</th>
            <th className="border border-gray-300 px-6 py-3">Leave Type</th>
            <th className="border border-gray-300 px-6 py-3">Start Date</th>
            <th className="border border-gray-300 px-6 py-3">End Date</th>
            <th className="border border-gray-300 px-6 py-3">Description</th>
            <th className="border border-gray-300 px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              className="bg-white border-b dark:bg-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-3">{sno++}</td>
              <td className="px-6 py-3">{leave.leaveType}</td>
              <td className="px-6 py-3">
                {new Date(leave.startDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-3">
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-3">{leave.reason}</td>
              <td className="px-6 py-3">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
