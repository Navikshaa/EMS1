import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ItModalContent from "./ModalContent/ItModalContent";
import SalesModalContent from "./ModalContent/SalesModalContent";
import MarketModalContent from "./ModalContent/MarketModalContent";

const Tasklist = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const [department, setDepartment] = useState(null);
  const [subDepartments, setSubDepartments] = useState([]);
  const [employeesByRole, setEmployeesByRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedSubDep, setSelectedSubDep] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (data?.department) {
          setDepartment(data.department);
          setSubDepartments(data.department.sub_departments || []);
          setError(null);
        } else {
          setError("Department not found.");
        }
      } catch (err) {
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchEmployeesByDepartment = async () => {
      if (!department?._id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/employee/users/roles/department/${department._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        let arr = [];
        if (role === "leader" && Array.isArray(data.roles?.leader)) {
          arr = data.roles.leader;
        } else if (role === "employee" && Array.isArray(data.roles?.employee)) {
          arr = data.roles.employee;
        } else {
          arr = Object.values(data.roles || {}).flat();
        }

        setEmployeesByRole(arr);
      } catch (err) {
        console.error("Failed to fetch employees by department:", err);
      }
    };

    fetchEmployeesByDepartment();
  }, [department, role]);

  const transformedSubDeps = subDepartments.map((sub, index) => ({
    _id: index.toString(),
    name: sub,
  }));

  const handleTaskSubmit = async () => {
    if (
      !selectedSubDep ||
      !selectedEmployee ||
      !taskTitle ||
      !message ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subDepartment", selectedSubDep);

      const selectedEmpObj = employeesByRole.find(
        (emp) => emp._id === selectedEmployee
      );
      const selectedEmpName =
        selectedEmpObj?.name || selectedEmpObj?.userId?.name || "";

      formData.append("employeeName", selectedEmpName);
      formData.append("employeeId", selectedEmployee);
      formData.append("task_title", taskTitle);
      formData.append("message", message);
      if (image) formData.append("initial_image", image);
      formData.append("startDate", dateRange[0].toISOString());
      formData.append("endDate", dateRange[1].toISOString());

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/task/assign", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to assign task");

      alert("Task assigned successfully!");
      setShowModal(false);
      setSelectedSubDep("");
      setSelectedEmployee("");
      setTaskTitle("");
      setMessage("");
      setImage(null);
      setDateRange([new Date(), new Date()]);
    } catch (err) {
      console.error(err);
      alert("Error assigning task.");
    }
  };

  const handleSalesSubmit = async ({
    subDepartment,
    employeeName,
    targetNumber,
  }) => {
    if (!subDepartment || !employeeName || !targetNumber) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subDepartment, employeeName, targetNumber }),
      });
      if (!res.ok) throw new Error("Failed to save target");

      alert("Target saved successfully!");
      setShowModal(false);
      setSelectedSubDep("");
      setSelectedEmployee("");
    } catch (err) {
      console.error(err);
      alert("Error saving target");
    }
  };

  const handleMarketSubmit = async ({
    subDepartment,
    employeeName,
    targetNumber,
    total_points,
  }) => {
    if (!subDepartment || !employeeName || !targetNumber || !total_points) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subDepartment,
          employeeName,
          targetNumber,
          total_points,
        }),
      });

      if (!res.ok) throw new Error("Failed to save market task");

      alert("Market task saved successfully!");
      setShowModal(false);
      setSelectedSubDep("");
      setSelectedEmployee("");
    } catch (err) {
      console.error(err);
      alert("Error saving market task");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      {loading ? (
        <p className="text-center">Loading department details...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md px-4 py-2 text-center w-64">
              <h2 className="text-lg font-semibold text-gray-800">
                {department?.dep_name}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {subDepartments.length === 0 ? (
              <p className="text-gray-600">No sub-departments found.</p>
            ) : (
              subDepartments.map((sub) => (
                <div
                  key={sub}
                  className={`bg-white px-4 py-2 text-sm rounded-lg shadow text-gray-800 cursor-pointer hover:bg-blue-100 hover:scale-105 hover:shadow-lg transition-all duration-300 transform ${
                    selectedSubDep === sub ? "bg-blue-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedSubDep(sub);
                    setSelectedEmployee("");
                  }}
                >
                  {sub}
                </div>
              ))
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-[10px] right-[10px] text-2xl text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-md"
              title="Create Task"
            >
              +
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>

                {department?.dep_name === "IT" && (
                  <ItModalContent
                    subDepartments={transformedSubDeps}
                    selectedSubDep={selectedSubDep}
                    setSelectedSubDep={setSelectedSubDep}
                    employees={employeesByRole}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    taskTitle={taskTitle}
                    setTaskTitle={setTaskTitle}
                    message={message}
                    setMessage={setMessage}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    image={image}
                    setImage={setImage}
                    handleTaskSubmit={handleTaskSubmit}
                  />
                )}

                {department?.dep_name === "Sales" && (
                  <SalesModalContent
                    subDepartments={subDepartments}
                    selectedSubDep={selectedSubDep}
                    setSelectedSubDep={setSelectedSubDep}
                    employees={employeesByRole}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    onSubmit={handleSalesSubmit}
                  />
                )}

                {department?.dep_name === "Marketing" && (
                  <MarketModalContent
                    subDepartments={subDepartments}
                    selectedSubDep={selectedSubDep}
                    setSelectedSubDep={setSelectedSubDep}
                    employees={employeesByRole}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    onSubmit={handleMarketSubmit}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tasklist;
