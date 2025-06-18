import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../../../utils/HrEmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [subDepartments, setSubDepartments] = useState([]);
  const STEPS = ["Basic", "Personal", "Employment", "Bank"];
  const [currentStep, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  if (!isOpen) return null;

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "department") {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/department/${value}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const subDeps = response.data.department.sub_departments || [];
          setSubDepartments(subDeps);
          setFormData((prev) => ({ ...prev, designation: "" }));
        } catch (error) {
          console.error("Failed to fetch sub-departments:", error);
          setSubDepartments([]);
        }
      }
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    for (const key in formData) {
      if (key !== "designation") {
        formDataObj.append(key, formData[key]);
      }
    }

    const selectedSubDep = subDepartments.find(
      (subDep) => subDep._id === formData.designation
    );

    formDataObj.append(
      "designation",
      selectedSubDep ? selectedSubDep.name : formData.designation
    );

    if (imageFile) {
      formDataObj.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/employee/add",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData?.role === "admin") {
          navigate("/admin-dashboard/employees");
        } else {
          navigate("/employee-dashboard/task/employees");
        }
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert(error?.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-2">
      <div className="max-w-4xl w-full bg-gray-100 p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-1 text-3xl text-gray-700 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>

        <div className="flex justify-between mb-6">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`px-4 py-1 rounded-2xl ${
                i === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name and Last Name Fields */}
            {currentStep === 0 && (
              <fieldset className="col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={formData.name || ""}
                    placeholder="Enter Full Name"
                    className="flex mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email || ""}
                    placeholder="Enter Email"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone || ""}
                    placeholder="Enter Phone Number"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/*NATIONALITY Field*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NATIONALITY
                  </label>
                  <select
                    name="nationality"
                    onChange={handleChange}
                    value={formData.nationality || ""}
                    placeholder="Select"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Nationality </option>
                    <option value="indian">Indian</option>
                    <option value="nepal">Nepal</option>
                    <option value="bhutan">Bhutan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    onChange={handleChange}
                    value={formData.gender || ""}
                    placeholder="Select"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Gender </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleChange}
                    value={formData.dob || ""}
                    placeholder="Enter Date of Birth"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    onChange={handleChange}
                    value={formData.status || ""}
                    placeholder="Select Status"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </fieldset>
            )}

            {/* NVKSH PERNO Field */}
            {currentStep === 1 && (
              <fieldset className="col-span-2">
                {/* Marital Status Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    onChange={handleChange}
                    value={formData.maritalStatus || ""}
                    placeholder="Select Marital Status"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>

                {/*  PAN Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PAN
                  </label>
                  <input
                    type="text"
                    name="pan"
                    onChange={handleChange}
                    value={formData.pan || ""}
                    placeholder="Enter PAN"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Aadhar Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Number
                  </label>
                  <input
                    type="number"
                    name="aadhar"
                    onChange={handleChange}
                    value={formData.aadhar || ""}
                    placeholder="Enter Aadhar Number"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Permanent Address
                  </label>
                  <input
                    type="text"
                    name="permanentaddress"
                    onChange={handleChange}
                    value={formData.permanentaddress || ""}
                    placeholder="Enter Permanent Address"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Address1 Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address1"
                    onChange={handleChange}
                    value={formData.address1 || ""}
                    placeholder="Enter Address Line 1"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                {/* Address2 Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    onChange={handleChange}
                    value={formData.address2 || ""}
                    placeholder="Enter Address Line 2"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                {/* Correspondence Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correspondence Address
                  </label>
                  <input
                    type="text"
                    name="correspondenceAddress"
                    onChange={handleChange}
                    value={formData.correspondenceAddress || ""}
                    placeholder="Enter Correspondence Address"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                {/* Correspondence Address 1 Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correspondence Address Line 1
                  </label>
                  <input
                    type="text"
                    name="correspondenceAddress1"
                    onChange={handleChange}
                    value={formData.correspondenceAddress1 || ""}
                    placeholder="Enter Correspondence Address Line 1"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                {/* Correspondence Address 2 Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correspondence Address Line 2
                  </label>
                  <input
                    type="text"
                    name="correspondenceAddress2"
                    onChange={handleChange}
                    value={formData.correspondenceAddress2 || ""}
                    placeholder="Enter Correspondence Address Line 2"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
              </fieldset>
            )}

            {currentStep === 2 && (
              <fieldset className="col-span-2">
                {/* UserName */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    UserName
                  </label>
                  <input
                    type="number"
                    name="username"
                    onChange={handleChange}
                    value={formData.username || ""}
                    placeholder="Enter UserName"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* NVKSH PERNO Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NVKSH PERNO
                  </label>
                  <input
                    type="number"
                    name="nvkshPerno"
                    onChange={handleChange}
                    value={formData.nvkshPerno || ""}
                    placeholder="Enter NVKSH PERNO"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* NVKSH UNIT PERNO Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NVKSH UNIT PERNO
                  </label>
                  <input
                    type="number"
                    name="nvkshUnitPerno"
                    onChange={handleChange}
                    value={formData.nvkshUnitPerno || ""}
                    placeholder="Enter NVKSH UNIT PERNO"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/*  GRADE Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GRADE
                  </label>
                  <select
                    name="grade"
                    onChange={handleChange}
                    value={formData.grade || ""}
                    placeholder="Select Grade"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="S3">S3</option>
                    <option value="S2">S2</option>
                    <option value="S1">S1</option>
                    <option value="S0">S0</option>
                    <option value="E3">E3</option>
                    <option value="E2">E2</option>
                    <option value="E1">E1</option>
                    <option value="E0">E0</option>
                  </select>
                </div>

                {/* Department Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    name="department"
                    onChange={handleChange}
                    value={formData.department || ""}
                    placeholder="Select Department"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
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
                {/* Designation Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <select
                    name="designation"
                    value={formData.designation || ""}
                    disabled={!subDepartments.length}
                    onChange={handleChange}
                    placeholder="Select Designation"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Designation</option>
                    {subDepartments.map((subDep, index) => (
                      <option key={index} value={subDep}>
                        {subDep}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    onChange={handleChange}
                    value={formData.employeeId || ""}
                    placeholder="Enter Employee ID"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* DOJ Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    name="doj"
                    onChange={handleChange}
                    value={formData.doj || ""}
                    placeholder="Enter Date of Joining"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Salary Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CTC
                  </label>
                  <input
                    type="number"
                    name="salary"
                    onChange={handleChange}
                    value={formData.salary || ""}
                    placeholder="Enter CTC"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    onChange={handleChange}
                    value={formData.role || ""}
                    placeholder="Select Role"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="manager">Manager</option>
                    <option value="leader">Leader</option>
                  </select>
                </div>

                {/*Type of Hire Field*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type of Hire
                  </label>
                  <select
                    name="hire"
                    onChange={handleChange}
                    value={formData.hire || ""}
                    placeholder="Select Hire Type"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Type of Hire </option>
                    <option value="fullTime">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="provision">Provision</option>
                  </select>
                </div>
              </fieldset>
            )}

            {currentStep === 3 && (
              <fieldset className="col-span-2">
                {/* Bank Account Details Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank A/C No
                  </label>
                  <input
                    type="number"
                    name="bankac"
                    placeholder="Enter Bank A/C No"
                    onChange={handleChange}
                    value={formData.bankac || ""}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Bank Account Holder Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="bankacname"
                    onChange={handleChange}
                    value={formData.bankacname || ""}
                    placeholder="Enter Bank Account Holder Name"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Bank Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankname"
                    onChange={handleChange}
                    value={formData.bankname || ""}
                    placeholder="Enter Bank Name"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Branch Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="branchname"
                    onChange={handleChange}
                    value={formData.branchname || ""}
                    placeholder="Enter Branch Name"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {/* Account Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    onChange={handleChange}
                    value={formData.accountType || ""}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                  </select>
                </div>

                {/* IFSC Code Field */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    onChange={handleChange}
                    value={formData.ifsc || ""}
                    placeholder="Enter IFSC Code"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password || ""}
                    placeholder="Enter Password"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    placeholder="Upload Image"
                    accept="image/*"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
              </fieldset>
            )}
          </div>
          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prev}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-2xl"
              >
                Back
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-2xl ml-auto"
              >
                Save & Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-2xl ml-auto"
              >
                Add Employee
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
