import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
    sub_departments: "",
  });

  const [availableDepartments, setAvailableDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setAvailableDepartments(res.data.departments);
        }
      } catch (err) {
        alert("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dep_name") {
      const existing = availableDepartments.find((d) => d.dep_name === value);
      setDepartment({
        ...department,
        [name]: value,
        description: existing ? existing.description : "",
      });
    } else {
      setDepartment({ ...department, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subDepArray = department.sub_departments
      .split(",")
      .map((sub) => sub.trim())
      .filter((sub) => sub !== "");

    try {
      const payload = {
        dep_name: department.dep_name,
        description: department.description,
        sub_departments: subDepArray,
      };

      const response = await axios.post(
        "http://localhost:3000/api/department/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error saving department");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Add Department</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="dep_name"
            className="text-sm font-medium text-gray-700"
          >
            Department Name
          </label>
          <select
            name="dep_name"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Department</option>
            {availableDepartments.map((dep) => (
              <option key={dep._id} value={dep.dep_name}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            onChange={handleChange}
            placeholder="Enter department description"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            rows="3"
            required
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="sub_departments"
            className="block text-sm font-medium text-gray-700"
          >
            Sub-Departments (comma-separated)
          </label>
          <input
            type="text"
            name="sub_departments"
            value={department.sub_departments}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            placeholder="e.g. HR, IT, Marketing"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
