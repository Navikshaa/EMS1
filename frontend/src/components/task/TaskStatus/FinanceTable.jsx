import React, { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaRegClock,
  FaEdit,
  FaSave,
  FaTimesCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FinanceTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [clicked, setClicked] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tasks, setTasks] = useState([]);

  const shownToastsRef = useRef(new Set());
  const audioRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/salestask");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    const audioAllowed = localStorage.getItem("audioAllowed");
    const today = new Date().toDateString();

    const hasPendingToday = tasks.some(
      (task) =>
        task.pending_date &&
        new Date(task.pending_date).toDateString() === today
    );

    if (audioAllowed === "true" && hasPendingToday) {
      const audio = document.getElementById("alertAudio");
      if (audio) {
        audio.play().catch((err) => {
          console.error("Autoplay error:", err.message);
        });
      }
    }
  }, [tasks]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Sound playback error:", err.message);
      });
    }
  };

  useEffect(() => {
    fetchSalesData();
    const stored = localStorage.getItem("clickedButtons");
    if (stored) setClicked(JSON.parse(stored));
  }, []);

  const fetchSalesData = () => {
    fetch("http://localhost:3000/api/salestask")
      .then((res) => res.json())
      .then((data) => {
        setSalesData(data);
        checkForTodayTasks(data);
      })
      .catch((err) => console.error("Fetch failed:", err));
  };

  const checkForTodayTasks = (data) => {
    const today = new Date().toLocaleDateString("en-IN");

    data.forEach((item) => {
      const pending = item.pending_date
        ? new Date(item.pending_date).toLocaleDateString("en-IN")
        : null;

      if (pending === today && !shownToastsRef.current.has(item._id)) {
        toast.warning(
          `Reminder: ${item.customer_name}'s payment is due today`,
          {
            position: "top-right",
            onOpen: () => setTimeout(playSound, 300), // Important: slight delay
          }
        );
        shownToastsRef.current.add(item._id);
      }
    });
  };

  const handleMarkAsDone = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/salestask/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const updatedItem = await response.json();
      const updatedData = salesData.map((item) =>
        item._id === id ? { ...item, status: updatedItem.status } : item
      );
      setSalesData(updatedData);
      setClicked((prev) => ({ ...prev, [id]: { done: true } }));
      alert("Status updated to done");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to mark as done");
    }
  };

  const handleMarkAsDefault = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/salestask/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "default" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const updatedItem = await response.json();

      const updatedData = salesData.map((item) =>
        item._id === id ? { ...item, status: updatedItem.status } : item
      );

      setSalesData(updatedData);

      setClicked((prev) => ({ ...prev, [id]: { ...prev[id], default: true } }));

      alert("Status updated to default");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to mark as default");
    }
  };

  const handleEditDate = (item) => {
    setEditingId(item._id);
    setPendingDate(
      item.pending_date
        ? new Date(item.pending_date).toISOString().slice(0, 16)
        : ""
    );
    setModalOpen(true);
  };

  const handleDateSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/salestask/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pending_date: pendingDate }),
        }
      );
      const updatedItem = await response.json();
      const updatedData = salesData.map((item) =>
        item._id === editingId ? updatedItem : item
      );
      setSalesData(updatedData);
      setModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const filteredData = salesData.filter((item) => {
    const matchName = (item.customer_name || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchDate = searchDate
      ? new Date(item.createdAt).toLocaleDateString("en-CA") === searchDate
      : true;
    return matchName && matchDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { label: "SL NO.", width: 60 },
    { label: "NAME", width: 180, key: "customer_name" },
    { label: "EMAIL ADDRESS", width: 220, key: "email" },
    { label: "CONTACT NO.", width: 140, key: "contact_no" },
    { label: "WHATSAPP NO.", width: 140, key: "whatsapp_no" },
    { label: "DOMAIN INTERESTED", width: 180, key: "domain_interested" },
    { label: "TICKET SIZE", width: 140, key: "ticket_size" },
    { label: "REGISTRATION AMOUNT", width: 160, key: "registration_amount" },
    { label: "PENDING AMOUNT", width: 150, key: "pending_amount" },
    { label: "PENDING DATE", width: 180, key: "pending_date" },
    { label: "PROGRAM TYPE", width: 180, key: "program_type" },
    {
      label: "INTERNSHIP START DATE",
      width: 180,
      key: "internship_start_date",
    },
    { label: "INTERNSHIP END DATE", width: 180, key: "internship_end_date" },
    { label: "MARKETED FROM", width: 160, key: "marketed_from" },
    { label: "", width: 120, key: "actions", sticky: true },
  ];

  return (
    <div className="p-4 bg-white min-h-screen flex flex-col items-center">
      <ToastContainer />
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />

      <div className="w-full max-w-[1200px] bg-white rounded-lg">
        {/* Filters */}
        <div className="border-b px-4 py-3 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by Customer Name"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md p-2 w-48 border"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md p-2 w-48 border"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[480px] relative">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr>
                {columns.map(({ label, width, sticky }) => (
                  <th
                    key={label}
                    style={{
                      width,
                      minWidth: width,
                      position: "sticky",
                      top: 0,
                      ...(sticky ? { right: 0 } : {}),
                      backgroundColor: "#E5E7EB",
                      color: "#111827",
                      fontWeight: "500",
                      textAlign: "left",
                      padding: "8px",
                      zIndex: 10,
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => {
                const isEditing = editItem?._id === item._id;
                const today = new Date().toLocaleDateString("en-IN");
                const isToday =
                  item.pending_date &&
                  new Date(item.pending_date).toLocaleDateString("en-IN") ===
                    today;

                return (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor:
                        item.status === "default"
                          ? "#ffe5e5"
                          : idx % 2 === 0
                          ? "white"
                          : "#F9FAFB",
                    }}
                  >
                    <td className="text-center p-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>

                    {columns.slice(1, -1).map(({ key }) => {
                      let value = item[key];
                      if (
                        [
                          "internship_start_date",
                          "internship_end_date",
                          "pending_date",
                        ].includes(key) &&
                        value
                      ) {
                        value = new Date(value).toLocaleDateString("en-IN");
                      }

                      return (
                        <td key={key} className="p-2 truncate relative">
                          {value || "-"}
                          {key === "pending_date" && isToday && (
                            <span className="absolute top-1 left-1 w-3 h-3 bg-red-500 rounded-full" />
                          )}
                        </td>
                      );
                    })}

                    <td className="sticky right-0 bg-gray-100 p-2 z-10">
                      <div className="flex gap-2 items-center justify-center">
                        {isEditing ? (
                          <button
                            onClick={async () => {
                              const response = await fetch(
                                `http://localhost:3000/api/salestask/${editItem._id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(editItem),
                                }
                              );
                              const updatedItem = await response.json();
                              const updatedData = salesData.map((d) =>
                                d._id === updatedItem._id ? updatedItem : d
                              );
                              setSalesData(updatedData);
                              setEditItem(null);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                            title="Save"
                          >
                            <FaSave size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditItem(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white hover:bg-blue-600"
                            title="Edit Row"
                          >
                            <FaEdit size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleEditDate(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-500 text-white"
                          title="Edit Pending Date"
                        >
                          <FaRegClock size={16} />
                        </button>

                        <button
                          onClick={() => handleMarkAsDone(item._id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                            clicked[item._id]?.done
                              ? "bg-green-500 cursor-not-allowed"
                              : item.status === "partial_done"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : item.status === "done"
                              ? "bg-green-500 cursor-not-allowed"
                              : "bg-gray-500 hover:bg-gray-700"
                          }`}
                          title="Mark as Done"
                          disabled={
                            clicked[item._id]?.done || item.status === "done"
                          }
                        >
                          <FaCheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleMarkAsDefault(item._id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                            clicked[item._id]?.default
                              ? "bg-red-500 cursor-not-allowed"
                              : item.status === "default"
                              ? "bg-red-500 cursor-not-allowed"
                              : "bg-gray-500 hover:bg-red-600"
                          }`}
                          title="Mark as Default"
                          disabled={
                            clicked[item._id]?.default ||
                            item.status === "default"
                          }
                        >
                          <FaTimesCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t px-4 py-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === num + 1 ? "bg-gray-800 text-white" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border"
          >
            Next
          </button>
        </div>
      </div>

      {/* Pending Date Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded p-6 shadow-lg space-y-4 w-80">
            <h3 className="text-lg font-semibold">Edit Pending Date & Time</h3>
            <input
              type="datetime-local"
              className="w-full border p-2 rounded"
              value={pendingDate}
              onChange={(e) => setPendingDate(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDateSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceTable;
