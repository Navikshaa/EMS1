import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LeaveHeader from "../../assets/images/leave_task_header[1].png";
import { FaUpload } from "react-icons/fa"; // 📤 Upload icon

const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaveBalance, setLeaveBalance] = useState({
    casual: 24,
    medical: 12,
    earned: 12,
  });

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [form, setForm] = useState({
    leaveType: "",
    reason: "",
  });

  const [selectedDays, setSelectedDays] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [medicalProof, setMedicalProof] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/leave/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setLeaveHistory(res.data.leaves);
        updateBalances(res.data.leaves);
      }
    } catch (err) {
      alert("Error fetching leave data.");
    }
  };

  const updateBalances = (leaves) => {
    let casual = 24,
      medical = 12,
      earned = 12;

    leaves.forEach((l) => {
      if (l.status === "Rejected") return;

      const msPerDay = 1000 * 60 * 60 * 24;
      const rawDays =
        (new Date(l.endDate) - new Date(l.startDate)) / msPerDay + 1;
      const days = Math.round(rawDays);

      if (l.leaveType === "Casual Leave") {
        if (casual >= days) {
          casual -= days;
        } else {
          const remaining = days - casual;
          casual = 0;
          earned -= remaining;
        }
      } else if (l.leaveType === "Medical Leave") {
        medical -= days;
      }
    });

    setLeaveBalance({
      casual: Math.max(casual, 0),
      medical: Math.max(medical, 0),
      earned: Math.max(earned, 0),
    });
  };

  const handleCalendarChange = (range) => {
    setDateRange(range);
    if (range && range[0] && range[1]) {
      const diff =
        Math.round((range[1] - range[0]) / (1000 * 60 * 60 * 24)) + 1;
      setSelectedDays(diff);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateRange[0] || !dateRange[1]) {
      alert("Please select start and end dates.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("leaveType", form.leaveType);
      formData.append("reason", form.reason);
      formData.append("startDate", dateRange[0]);
      formData.append("endDate", dateRange[1]);

      if (form.leaveType === "Medical Leave" && medicalProof) {
        formData.append("medicalProof", medicalProof);
      }

      const res = await axios.post(
        "http://localhost:3000/api/leave/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Leave applied successfully!");
        navigate("/employee-dashboard");
      }
    } catch (err) {
      alert("Leave application failed.");
    }
  };

  const handlePrev = () => {
    if (currentIndex >= 3) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  const handleNext = () => {
    if (currentIndex + 3 < leaveHistory.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Leave Balances */}
      <div
        className="bg-cover bg-center py-10 px-4 mb-6"
        style={{ backgroundImage: `url(${LeaveHeader})` }}
      >
        <div className="max-w-5xl mx-auto flex justify-between gap-4">
          {[
            {
              type: "CASUAL LEAVE",
              value: leaveBalance.casual,
              color: "bg-yellow-300",
            },
            {
              type: "MEDICAL LEAVE",
              value: leaveBalance.medical,
              color: "bg-yellow-300",
            },
            {
              type: "EARNED LEAVE",
              value: leaveBalance.earned,
              color: "bg-yellow-300",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex-1 bg-white rounded-xl shadow-md text-center py-6"
            >
              <div className="text-4xl font-bold">{item.value}</div>
              <div
                className={`mt-3 inline-block text-sm font-medium px-4 py-1 rounded-full ${item.color}`}
              >
                {item.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave History Cards with Navigation */}
      <div className="flex items-center justify-between mb-6 px-4">
        <button
          onClick={handlePrev}
          className="bg-gray-300 px-3 py-2 rounded disabled:opacity-50"
          disabled={currentIndex === 0}
        >
          ⬅️
        </button>

        <div className="flex space-x-16 overflow-hidden w-full justify-center px-8">
          {leaveHistory.slice(currentIndex, currentIndex + 3).map((l, idx) => (
            <div
              key={idx}
              className="min-w-[280px] bg-white rounded-xl shadow p-6"
            >
              <h4 className="font-semibold">{l.leaveType.toUpperCase()}</h4>
              <p
                className={`text-white px-3 py-1 mt-2 inline-block rounded-full text-sm ${
                  l.status === "Approved"
                    ? "bg-green-500"
                    : l.status === "Rejected"
                    ? "bg-red-400"
                    : "bg-yellow-400"
                }`}
              >
                {l.status.toUpperCase()}
              </p>
              <p className="text-sm mt-2">
                {new Date(l.startDate).toLocaleDateString()} -{" "}
                {new Date(l.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-gray-300 px-3 py-2 rounded disabled:opacity-50"
          disabled={currentIndex + 3 >= leaveHistory.length}
        >
          ➡️
        </button>
      </div>

      {/* Leave Application Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Select Date Range
            </label>
            <Calendar
              selectRange
              onChange={handleCalendarChange}
              value={dateRange}
              className="w-full rounded-lg border border-gray-600 p-4"
            />
            {selectedDays > 0 && (
              <p className="mt-2 text-gray-600">
                You selected {selectedDays} days
              </p>
            )}
          </div>

          {/* Leave Type + Reason + File Upload */}
          <div className="flex flex-col gap-4">
            <select
              name="leaveType"
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded h-[42px]"
            >
              <option value="">Select Leave Type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
            </select>

            <textarea
              name="reason"
              onChange={handleChange}
              placeholder="Reason for leave"
              required
              className="p-2 border border-gray-300 rounded flex-1 min-h-[120px]"
            />

            {form.leaveType === "Medical Leave" && (
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Upload Medical Proof
                </label>
                <label
                  htmlFor="medicalProof"
                  className="flex items-center gap-2 cursor-pointer bg-gray-100 border border-dashed border-gray-400 p-3 rounded hover:bg-gray-200"
                >
                  <span className="text-blue-600 font-semibold">
                    Click to Upload
                  </span>
                  <FaUpload className="text-blue-600" />
                </label>
                <input
                  id="medicalProof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setMedicalProof(e.target.files[0])}
                  className="hidden"
                />
                {medicalProof && (
                  <p className="mt-1 text-sm text-green-600">
                    Selected: {medicalProof.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
