import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUserAlt,
  FaMale,
  FaFemale,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaVenusMars,
  FaUser,
  FaCheckCircle,
  FaBriefcase,
} from "react-icons/fa";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || "Failed to load employee details.";
        alert(message);
      }
    };

    fetchEmployee();
  }, [id]);

  const genderIcon = employee?.gender === "FEMALE" ? "♀" : "♂";

  return employee ? (
    <div className="max-w-md mx-auto  bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Cover Photo */}
      <div className="relative h-36 bg-cover bg-center bg-[url('https://i0.wp.com/linkedinheaders.com/wp-content/uploads/2018/02/mountain-clouds-header.jpg?fit=1584%2C396&ssl=1')]">
        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
          {employee?.userId?.profileImage ? (
            <img
              src={`http://localhost:3000/uploads/${employee.userId.profileImage}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-5xl text-white ${
                employee.gender === "FEMALE" ? "bg-pink-400" : "bg-blue-500"
              } animate-pulse`}
            >
              {employee.gender === "FEMALE" ? <FaFemale /> : <FaMale />}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-20 pb-4 px-6 text-center">
        {/* Name on the left */}
        <h2 className="text-2xl font-bold text-gray-900 text-left">
          {employee.userId.name}
        </h2>

        {/* NVKSH UNIT PERNO on the right */}
        <div className="bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
          {employee.nvkshUnitPerno}
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold mb-3 bg-white inline-block px-4 py-1 rounded-full">
          Basic Information
        </h3>
        <div className="space-y-2">
          <Info
            icon={<FaEnvelope />}
            label="Email - Address"
            value={employee.userId.email}
          />
          <Info
            icon={<FaPhone />}
            label="Mobile Phone"
            value={employee.phone}
          />
          <Info
            icon={<FaGlobe />}
            label="Nationality"
            value={employee.nationality}
          />
          <Info icon={<FaVenusMars />} label="Gender" value={employee.gender} />
          <Info icon={<FaUser />} label="Age" value={employee.age || "N/A"} />
          <Info icon={<FaCheckCircle />} label="Status" value="Active" />
          <Info
            icon={<FaBriefcase />}
            label="Type of Hire"
            value={employee.hire}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-10">Loading...</div>
  );
};

// Info component: icon + label + value
const Info = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 text-lg shadow">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase">{label}</p>
      <p className="text-gray-800 font-medium">{value || "N/A"}</p>
    </div>
  </div>
);

export default View;
