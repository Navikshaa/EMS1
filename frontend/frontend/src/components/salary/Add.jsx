import React, { useState, useEffect } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: null,
    grossPay: 0,
    basicSalary: 0,
    payFrom: "",
    payTo: "",
    payDate: "",
    overtimeHours: 0,
    lopDays: 0,
    lateLogins: 0,
    halfDays: 0,
    targetAllowance: 0,
    overtimeAllowance: 0,
    targetPenalty: 0,
    loan: 0,
    pt: 0,
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [calculated, setCalculated] = useState({
    allowances: {},
    deductions: {},
    netSalary: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value);
    setEmployees(emps);
  };

  const handleEmployee = (e) => {
    const selectedEmpId = e.target.value;
    const selectedEmp = employees.find((emp) => emp._id === selectedEmpId);
    if (selectedEmp) {
      const ctc = selectedEmp.salary || 0;
      const grossPay = Math.floor(ctc / 12);
      const basicSalary = grossPay * 0.7;
      setSalary((prev) => ({
        ...prev,
        employeeId: selectedEmp._id,
        grossPay,
        basicSalary,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isDateField = ["payFrom", "payTo", "payDate"].includes(name);
    setSalary((prev) => ({
      ...prev,
      [name]: isDateField ? value : parseFloat(value) || 0,
    }));
  };

  useEffect(() => {
    const gross = salary.grossPay;
    const basic = salary.basicSalary;
    const perDay = gross / 30;

    const allowances = {
      houseRent: gross * 0.09,
      medical: gross * 0.042,
      travel: gross * 0.068,
      food: gross * 0.1,
      overTime: salary.overtimeHours * 200,
      overtimeAllowance: salary.overtimeAllowance,
      target: salary.targetAllowance,
    };

    const deductions = {
      pf: gross * 0.1,
      leaveOfAbsence: perDay * salary.lopDays,
      lateLogin: salary.lateLogins * 300,
      halfDay: (perDay / 2) * salary.halfDays,
      targetPenalty: salary.targetPenalty,
      loan: salary.loan,
      pt: salary.pt,
    };

    const totalAllowances = Object.values(allowances).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalDeductions = Object.values(deductions).reduce(
      (sum, val) => sum + val,
      0
    );
    const netSalary = basic + totalAllowances - totalDeductions;

    setCalculated({ allowances, deductions, netSalary });
  }, [salary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/salary/add",
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      alert(error?.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleDepartment}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              name="employeeId"
              onChange={handleEmployee}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gross Pay
            </label>
            <input
              type="number"
              name="grossPay"
              value={salary.grossPay}
              readOnly
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={salary.basicSalary}
              readOnly
              className="mt-1 p-2 w-full border rounded"
            />
          </div>

          {/* Pay Date FROM */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Date From
            </label>
            <input
              type="date"
              name="payFrom"
              value={salary.payFrom}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Pay Date TO */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Date To
            </label>
            <input
              type="date"
              name="payTo"
              value={salary.payTo}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Pay Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Date
            </label>
            <input
              type="date"
              name="payDate"
              value={salary.payDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>

          {/* Add other dynamic input fields */}
          {[
            { label: "Overtime Hours", name: "overtimeHours" },
            { label: "Professional Tax", name: "pt" },
            { label: "LOP Days", name: "lopDays" },
            { label: "Late Logins", name: "lateLogins" },
            { label: "Half Days", name: "halfDays" },
            { label: "OverTime Allowance", name: "overtimeAllowance" },
            { label: "Target Allowance", name: "targetAllowance" },
            { label: "Target Penalty", name: "targetPenalty" },
            { label: "Loan Deduction", name: "loan" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="number"
                name={name}
                value={salary[name]}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          ))}
        </div>

        {/* Allowance Breakdown */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Allowances (Calculated)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(calculated.allowances).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                </label>
                <input
                  type="number"
                  readOnly
                  value={value.toFixed(2)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Deduction Breakdown */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Deductions (Calculated)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(calculated.deductions).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                </label>
                <input
                  type="number"
                  readOnly
                  value={value.toFixed(2)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Net Pay Preview */}
        <div className="mt-6">
          <label className="block text-lg font-semibold text-gray-800">
            Net Salary
          </label>
          <input
            type="number"
            value={calculated.netSalary.toFixed(2)}
            readOnly
            className="mt-1 p-3 block w-full border border-green-600 rounded-md font-bold text-green-800 bg-green-50"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Salary
        </button>
      </form>
    </div>
  );
};

export default Add;
