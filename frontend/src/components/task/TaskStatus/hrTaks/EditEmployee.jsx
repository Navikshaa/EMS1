import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchDepartments } from "../../../../utils/EmployeeHelper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEmployee = ({ isOpen, onClose, employeeId }) => {
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: "",
    status: "active",
    role: "",
    department: "",
    username: "",
    nvkshPerno: "",
    nvkshUnitPerno: "",
    grade: "",
    employeeIdText: "",
    doj: "",
    hire: "",
    bankac: "",
    bankacname: "",
    bankname: "",
    branchname: "",
    accountType: "",
    ifsc: "",
  });

  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState("employment");
  const [loading, setLoading] = useState(false); // 🔄 Add loading state

  useEffect(() => {
    const getDepartments = async () => {
      const dep = await fetchDepartments();
      setDepartments(dep || []);
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/employee/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          const emp = res.data.employee;
          setEmployee({
            name: emp?.userId?.name || "",
            maritalStatus: emp.maritalStatus || "",
            designation: emp.designation || "",
            salary: emp.salary || "",
            status: emp.status || "active",
            role: emp.role || "",
            department: emp.department || "",
            username: emp?.userId?.username || "",
            nvkshPerno: emp.nvkshPerno || "",
            nvkshUnitPerno: emp.nvkshUnitPerno || "",
            grade: emp.grade || "",
            employeeIdText: emp.employeeId || "",
            doj: emp.doj ? emp.doj.slice(0, 10) : "",
            hire: emp.hire || "",
            bankac: emp.bankac || "",
            bankacname: emp.bankacname || "",
            bankname: emp.bankname || "",
            branchname: emp.branchname || "",
            accountType: emp.accountType || "",
            ifsc: emp.ifsc || "",
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Error fetching employee.");
      }
    };

    if (employeeId) fetchEmployee();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const res = await axios.put(
        `http://localhost:3000/api/employee/${employeeId}`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Employee updated successfully!", { autoClose: 2000 });
        setTimeout(() => {
          onClose(); // Close modal after delay
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating employee.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white max-w-5xl w-full p-8 rounded-md shadow-lg overflow-y-auto max-h-[90vh]">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Employee</h2>
          <button onClick={onClose} className="text-red-500 text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("employment")}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "employment"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Employment Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "bank" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Bank Details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Employment Details */}
          {activeTab === "employment" && (
            <section>
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                />
                <Select
                  label="Marital Status"
                  name="maritalStatus"
                  value={employee.maritalStatus}
                  onChange={handleChange}
                  options={["single", "married", "divorced"]}
                />
                <Input
                  label="Username"
                  name="username"
                  value={employee.username}
                  onChange={handleChange}
                  type="number"
                />
                <Input
                  label="NVKSH PERNO"
                  name="nvkshPerno"
                  value={employee.nvkshPerno}
                  onChange={handleChange}
                  type="number"
                />
                <Input
                  label="NVKSH UNIT PERNO"
                  name="nvkshUnitPerno"
                  value={employee.nvkshUnitPerno}
                  onChange={handleChange}
                  type="number"
                />
                <Select
                  label="Grade"
                  name="grade"
                  value={employee.grade}
                  onChange={handleChange}
                  options={["S3", "S2", "S1", "S0", "E3", "E2", "E1", "E0"]}
                />
                <Input
                  label="Employee ID"
                  name="employeeIdText"
                  value={employee.employeeIdText}
                  onChange={handleChange}
                />
                <Input
                  label="Date of Joining"
                  name="doj"
                  type="date"
                  value={employee.doj}
                  onChange={handleChange}
                />
                <Input
                  label="CTC"
                  name="salary"
                  type="number"
                  value={employee.salary}
                  onChange={handleChange}
                />
                <Select
                  label="Department"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  options={departments.map((d) => ({
                    value: d._id,
                    label: d.dep_name,
                  }))}
                />
                <Input
                  label="Designation"
                  name="designation"
                  value={employee.designation}
                  onChange={handleChange}
                />
                <Select
                  label="Role"
                  name="role"
                  value={employee.role}
                  onChange={handleChange}
                  options={["admin", "employee", "hr", "manager", "leader"]}
                />
                <Select
                  label="Type of Hire"
                  name="hire"
                  value={employee.hire}
                  onChange={handleChange}
                  options={["fullTime", "Internship", "provision"]}
                />
                <Select
                  label="Status"
                  name="status"
                  value={employee.status}
                  onChange={handleChange}
                  options={["active", "inactive", "terminated"]}
                />
              </div>
            </section>
          )}

          {/* Bank Details */}
          {activeTab === "bank" && (
            <section>
              <h3 className="text-xl font-semibold mb-4 text-green-700">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bank A/C No"
                  name="bankac"
                  value={employee.bankac}
                  onChange={handleChange}
                  type="number"
                />
                <Input
                  label="Account Holder Name"
                  name="bankacname"
                  value={employee.bankacname}
                  onChange={handleChange}
                />
                <Input
                  label="Bank Name"
                  name="bankname"
                  value={employee.bankname}
                  onChange={handleChange}
                />
                <Input
                  label="Branch Name"
                  name="branchname"
                  value={employee.branchname}
                  onChange={handleChange}
                />
                <Select
                  label="Account Type"
                  name="accountType"
                  value={employee.accountType}
                  onChange={handleChange}
                  options={["savings", "current"]}
                />
                <Input
                  label="IFSC Code"
                  name="ifsc"
                  value={employee.ifsc}
                  onChange={handleChange}
                />
              </div>
            </section>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 text-white font-bold py-2 px-4 rounded ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

// 🔧 Reusable Input Component
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      required
    />
  </div>
);

// 🔧 Reusable Select Component
const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) =>
        typeof opt === "string" ? (
          <option key={i} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  </div>
);

export default EditEmployee;
