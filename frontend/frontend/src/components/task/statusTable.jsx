import React, { useEffect, useState } from "react";
import axios from "axios";

const StatusTable = () => {
  const [groupedTasks, setGroupedTasks] = useState({
    pending: [],
    delay: [],
    completed: [],
    review: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/task", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const tasks = res.data.tasks || [];

      const today = new Date();
      const grouped = {
        pending: [],
        delay: [],
        completed: [],
        review: [],
      };

      tasks.forEach((task) => {
        const status = task.status?.toLowerCase();
        const title = task.message || "Untitled Task";

        if (status === "pending") grouped.pending.push(title);
        else if (status === "review") grouped.review.push(title);
        else if (status === "done") grouped.completed.push(title);
        else {
          const endDate = new Date(task.endDate);
          if (endDate < today) grouped.delay.push(title);
        }
      });

      setGroupedTasks(grouped);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Task Status Table</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Pending</th>
                <th className="py-2 px-4">Delay</th>
                <th className="py-2 px-4">Completed</th>
                <th className="py-2 px-4">Review</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {["pending", "delay", "completed", "review"].map((key) => (
                  <td key={key} className="align-top py-2 px-4">
                    {groupedTasks[key].length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {groupedTasks[key].map((title, index) => (
                          <li key={index}>{title}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">No tasks</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatusTable;
