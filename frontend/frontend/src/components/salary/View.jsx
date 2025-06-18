import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      console.error("Failed to fetch salaries:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (e) => {
    const query = e.target.value;
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId?.employeeId
        ?.toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  if (!filteredSalaries) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Salary Payslips
      </h2>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Employee ID"
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          onChange={filterSalaries}
        />
      </div>

      {filteredSalaries.length > 0 ? (
        filteredSalaries.map((salary, index) => (
          <div
            key={salary._id}
            className="border border-gray-300 rounded-lg p-6 shadow mb-8 bg-white"
          >
            <h3 className="text-xl font-bold text-blue-700 mb-4">
              PAYSLIP - {new Date(salary.payDate).toLocaleDateString()}
            </h3>

            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p><strong>Employee ID:</strong> {salary.employeeId?.employeeId || "N/A"}</p>
                <p><strong>Basic Salary:</strong> ₹ {salary.basicSalary.toFixed(2)}</p>
                <p><strong>Overtime Hours:</strong> {salary.overtimeHours}</p>
                <p><strong>LOP Days:</strong> {salary.lopDays}</p>
              </div>
              <div>
                <p><strong>Pay Date:</strong> {new Date(salary.payDate).toLocaleDateString()}</p>
                <p><strong>Gross Pay:</strong> ₹ {(salary.basicSalary + Object.values(salary.allowances).reduce((a, b) => a + b, 0)).toFixed(2)}</p>
                <p><strong>Total Deductions:</strong> ₹ {Object.values(salary.deductions).reduce((a, b) => a + b, 0).toFixed(2)}</p>
                <p><strong>Net Salary:</strong> ₹ {salary.netSalary.toFixed(2)}</p>
              </div>
            </div>

            {/* Allowances and Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700 underline mb-2">Earnings</h4>
                <ul className="space-y-1">
                  {Object.entries(salary.allowances).map(([key, val]) => (
                    <li key={key}>
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()} : ₹ {val.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 underline mb-2">Deductions</h4>
                <ul className="space-y-1">
                  {Object.entries(salary.deductions).map(([key, val]) => (
                    <li key={key}>
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()} : ₹ {val.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 text-xs text-gray-500 italic text-center">
              This is a computer-generated payslip. For discrepancies, contact Finance.
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 mt-10">No salary records found.</div>
      )}
    </div>
  );
};

export default View;
