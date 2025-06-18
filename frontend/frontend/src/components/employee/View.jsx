import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        alert("Failed to load employee details.");
      }
    };
    fetchEmployee();
  }, [id]);

  const renderTabButton = (label, value) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-6 py-2 rounded-full transition-colors text-lg font-bold ${
        activeTab === value
          ? "bg-gray-800 text-white"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {label}
    </button>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white p-6 rounded-md shadow-md mt-4">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Info = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase">{label}</p>
      <div className="border-b border-gray-300 py-1 text-gray-800">{value || "N/A"}</div>
    </div>
  );

  if (!employee) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-1 bg-gray-100 p-6 rounded-xl shadow h-[99vh] overflow-hidden">
      {/* Sticky Tab Bar */}
      <div className="sticky top-0 bg-gray-100 z-10 border-b pb-4 flex justify-around">
        {renderTabButton("Personal Information", "personal")}
        {renderTabButton("Employment", "employment")}
        {renderTabButton("Bank Details", "bank")}
      </div>

      {/* Scrollable Section */}
      <div className="overflow-y-auto h-[calc(100%-3rem)] pr-2">
        {activeTab === "personal" && (
          <Section title="Personal Information">
            <Info label="Username" value={employee.userId.name} />
            <Info label="Marital Status" value={employee.maritalStatus} />
            <Info label="PAN Number" value={employee.pan} />
            <Info label="Aadhaar Number" value={employee.aadhar} />
            <Info label="Permanent Address" value={employee.permanentAddress || "N/A"} />
            <Info label="Address 1" value={employee.address1 || "N/A"} />
            <Info label="Address 2" value={employee.address2 || "N/A"} />
            <Info label="Correspondence Address" value={employee.correspondenceAddress || "N/A"} />
            <Info label="Corr. Address 1" value={employee.corrAddress1 || "N/A"} />
            <Info label="Corr. Address 2" value={employee.corrAddress2 || "N/A"} />
          </Section>
        )}

        {activeTab === "employment" && (
          <Section title="Employment">
            <Info label="NVKSH PERNO." value={employee.nvkshPerno} />
            <Info label="NVKSH UNIT PERNO." value={employee.nvkshUnitPerno} />
            <Info label="Grade" value={employee.grade} />
            <Info label="Department" value={employee.department?.dep_name || "N/A"} />
            <Info label="Designation" value={employee.designation} />
            <Info label="Employee ID" value={employee.employeeId} />
            <Info label="Date of Joining" value={new Date(employee.doj).toLocaleDateString()} />
            <Info label="CTC (Fixed)" value={`₹ ${employee.salary || "N/A"}`} />
            <Info label="CTC (Variable)" value={employee.ctcVariable || "N/A"} />
            <Info label="Role" value={employee.role || "N/A"} />
          </Section>
        )}

        {activeTab === "bank" && (
          <Section title="Bank Details">
            <Info label="Bank A/c No." value={employee.bankac} />
            <Info label="Bank A/c Holder Name" value={employee.bankacname} />
            <Info label="Bank Name" value={employee.bankname} />
            <Info label="Branch Name" value={employee.branchname} />
            <Info label="A/c Type" value={employee.accountType} />
            <Info label="IFSC Code" value={employee.ifsc} />
          </Section>
        )}
      </div>
    </div>
  );
};

export default View;
