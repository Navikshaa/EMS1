import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

// Legend component
const Legend = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-4 h-4 rounded ${color}`}></div>
    <span className="text-sm">{label}</span>
  </div>
);

// Format a date as YYYY-MM-DD
const formatDate = (date) => date.toLocaleDateString("en-CA");

// Normalize status
const normalizeStatus = (status) => {
  const s = status?.toLowerCase() || "";
  if (s.includes("absent")) return "Absent";
  if (s.includes("half")) return "Half Day";
  if (s.includes("late")) return "Late";
  if (s.includes("on time")) return "On Time";
  if (s.includes("holiday")) return "Holiday";
  if (s.includes("sunday")) return "Sunday";
  return "No Login";
};

// Define status priority
const getStatusPriority = (status) => {
  switch (normalizeStatus(status)) {
    case "Absent":
      return 6;
    case "Half Day":
      return 5;
    case "Late":
      return 4;
    case "On Time":
      return 3;
    case "Holiday":
      return 2;
    case "Sunday":
      return 1;
    case "No Login":
      return 0;
    default:
      return -1;
  }
};

// Main component
const AttendanceEditView = ({ userId }) => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:3000/api/login-history/${userId}`)
      .then((res) => {
        const rawData = res.data || [];

        if (rawData.length > 0) {
          const first = rawData[0];
          setUserDetails({
            name: first.username || "",
            department: first.department || "",
            employeeId: first.employeeId || "",
          });
        }

        // Group entries by date with most meaningful status
        const grouped = rawData.reduce((acc, entry) => {
          const dateKey = formatDate(new Date(entry.date));
          const prev = acc[dateKey];

          const currentPriority = getStatusPriority(entry.status);
          const prevPriority = prev ? getStatusPriority(prev.status) : -1;

          if (!prev || currentPriority > prevPriority) {
            acc[dateKey] = entry;
          }

          return acc;
        }, {});

        // Format the entries
        const formatted = Object.entries(grouped).map(([date, entry]) => {
          const login = entry.loginTime ? new Date(entry.loginTime) : null;
          const logout = entry.logoutTime ? new Date(entry.logoutTime) : null;

          return {
            ...entry,
            date,
            loginTime: login
              ? login.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "",
            logoutTime: logout
              ? logout.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "",
            status: normalizeStatus(entry.status),
          };
        });

        setAttendance(formatted);
      })
      .catch((err) => {
        console.error("Error fetching login history:", err);
        setError("Failed to fetch login history.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDateClick = (date) => {
    const clickedDate = formatDate(date);
    const found = attendance.find((a) => a.date === clickedDate);
    setSelectedDateData(found ? { ...found } : { date: clickedDate });
    setEditMode(false);
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const dateStr = formatDate(date);
    const record = attendance.find((a) => a.date === dateStr);

    const status =
      record?.status || (date.getDay() === 0 ? "Sunday" : "No Login");

    switch (status) {
      case "On Time":
        return "on-time";
      case "Late":
        return "late";
      case "Half Day":
        return "half-day";
      case "Holiday":
        return "holiday";
      case "Absent":
        return "absent";
      case "Sunday":
        return "sunday";
      default:
        return "no-login";
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEditSave = () => {
    const payload = {
      loginTime: selectedDateData.loginTime || "",
      logoutTime: selectedDateData.logoutTime || "",
      status: selectedDateData.status || "",
      date: selectedDateData.date,
    };

    const updateLocal = (newEntry) => {
      const updated = attendance.map((a) =>
        a.date === newEntry.date ? newEntry : a
      );
      if (!updated.some((a) => a.date === newEntry.date))
        updated.push(newEntry);
      setAttendance(updated);
    };

    if (selectedDateData._id) {
      axios
        .put(`http://localhost:3000/api/login-history/edit/${userId}`, payload)
        .then(() => {
          updateLocal({ ...selectedDateData });
          setEditMode(false);
          showMessage("Login history updated successfully!", "success");
        })
        .catch(() => showMessage("Error updating login history.", "error"));
    } else {
      axios
        .post("http://localhost:3000/api/login-history/", {
          ...payload,
          userId,
        })
        .then((res) => {
          const newEntry = {
            ...res.data,
            date: formatDate(new Date(res.data.date)),
            loginTime: new Date(res.data.loginTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            logoutTime: new Date(res.data.logoutTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            status: normalizeStatus(res.data.status),
          };
          updateLocal(newEntry);
          setSelectedDateData(newEntry);
          setEditMode(false);
          showMessage("Login history saved successfully!", "success");
        })
        .catch(() => showMessage("Error saving login history.", "error"));
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto relative">
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message}
        </div>
      )}

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-4 justify-between mb-6 border-b pb-3">
        <p>
          <b>Name:</b> {userDetails.name || "—"}
        </p>
        <p>
          <b>Department:</b> {userDetails.department || "—"}
        </p>
        <p>
          <b>Employee ID:</b> {userDetails.employeeId || userId || "—"}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Attendance Calendar
      </h2>

      <div className="calendar-container mb-4 max-w-md mx-auto">
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={getTileClassName}
        />
      </div>

      {!selectedDateData && (
        <p className="text-center text-gray-600 mb-4">
          <b>Click on a date to edit details.</b>
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <Legend color="bg-green-300" label="On Time" />
        <Legend color="bg-orange-300" label="Late" />
        <Legend color="bg-pink-300" label="Half Day" />
        <Legend color="bg-gray-300" label="Holiday" />
        <Legend color="bg-blue-300" label="Sunday" />
        <Legend color="border-2 border-gray-300" label="No Login" />
        <Legend color="bg-red-600 text-white" label="Absent" />
      </div>

      {selectedDateData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => {
                setSelectedDateData(null);
                setEditMode(false);
              }}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">
              {editMode ? "Edit Attendance" : "Attendance Details"} –{" "}
              {selectedDateData.date}
            </h3>
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm">Login Time:</label>
                  <input
                    type="time"
                    value={selectedDateData.loginTime || ""}
                    onChange={(e) =>
                      setSelectedDateData({
                        ...selectedDateData,
                        loginTime: e.target.value,
                      })
                    }
                    className="border p-1 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Logout Time:</label>
                  <input
                    type="time"
                    value={selectedDateData.logoutTime || ""}
                    onChange={(e) =>
                      setSelectedDateData({
                        ...selectedDateData,
                        logoutTime: e.target.value,
                      })
                    }
                    className="border p-1 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Status:</label>
                  <select
                    value={selectedDateData.status || ""}
                    onChange={(e) =>
                      setSelectedDateData({
                        ...selectedDateData,
                        status: e.target.value,
                      })
                    }
                    className="border p-1 w-full rounded"
                  >
                    <option value="">Select status</option>
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={handleEditSave}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Login:</strong> {selectedDateData.loginTime || "—"}
                </p>
                <p>
                  <strong>Logout:</strong> {selectedDateData.logoutTime || "—"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedDateData.status || "—"}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AttendancePage = () => {
  const { userId } = useParams();
  return userId ? (
    <AttendanceEditView userId={userId} />
  ) : (
    <p className="text-center mt-6 text-red-600">
      Please provide a userId in the URL.
    </p>
  );
};

export default AttendancePage;
