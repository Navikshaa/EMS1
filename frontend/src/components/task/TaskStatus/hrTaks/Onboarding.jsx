import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Hrtask from "../../../../assets/images/task_bg.jpeg";

const AddCandidate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    candidate_name: "",
    email: "",
    contact_no: "",
    whatsapp_no: "",
    date_of_joining: "",
    profile_type: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRemainingDays = (onboardedAt) => {
    if (!onboardedAt) return null;
    const diff =
      7 -
      Math.floor((Date.now() - new Date(onboardedAt)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/candidates/add", {
        ...formData,
        status: "pending",
      });
      setMessage("✅ Candidate added successfully!");
      setFormData({
        candidate_name: "",
        email: "",
        contact_no: "",
        whatsapp_no: "",
        date_of_joining: "",
        profile_type: "",
      });
      fetchCandidates();
      setTimeout(() => handleClose(), 800);
    } catch (err) {
      console.error("Error submitting form", err);
      setMessage("❌ Failed to add candidate.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:3000/api/candidates/${id}`, {
        status,
      });
      fetchCandidates();
    } catch (err) {
      console.error("Error updating candidate status", err);
    }
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...candidates].sort((a, b) => {
      const valA = a[key]?.toString().toLowerCase();
      const valB = b[key]?.toString().toLowerCase();
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
    setCandidates(sorted);
    setSortKey(key);
    setSortOrder(order);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(candidates);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "candidates.xlsx");
  };

  const onboardedCount = candidates.filter(
    (c) => c.status === "onboarded"
  ).length;
  const incompleteCount = candidates.length - onboardedCount;
  const onboardedPercentage = candidates.length
    ? Math.round((onboardedCount / candidates.length) * 100)
    : 0;
  const incompletePercentage = 100 - onboardedPercentage;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentCandidates = candidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(candidates.length / entriesPerPage);

  return (
    <>
      <div className={isOpen ? "blur-sm pointer-events-none select-none" : ""}>
        {/* Header */}
        {/* Header Section with Graphs */}

        <div
          className="bg-cover bg-center p-10 h-[300px] flex flex-col md:flex-row justify-between items-center gap-6 relative"
          style={{ backgroundImage: `url(${Hrtask})` }}
        >
          <button
            onClick={() => window.history.back()}
            className="absolute top-6 left-53 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow text-2xl"
          >
            ←
          </button>
          {/* LEFT GRAPH - ONBOARDING COMPLETE */}
          <div className="flex flex-col items-center w-[300px]">
            <div className="relative w-[260px] h-[180px]">
              <svg
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                viewBox="-10 10 120 20"
              >
                {/* Background Arc */}
                <path
                  d="M0,50 A50,50 0 0,1 100,50"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="14"
                />
                {/* Foreground Arc (Dynamic) */}
                <path
                  d="M0,50 A50,50 0 0,1 100,50"
                  fill="none"
                  stroke="#000"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * onboardedPercentage) / 100}
                  style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                />
              </svg>
              {/* Percentage Text */}
              <div
                className={`absolute top-[76%] left-[45%] font-bold text-xl ${
                  onboardedPercentage >= 75
                    ? "text-green-600"
                    : onboardedPercentage >= 50
                    ? "text-orange-500"
                    : "text-red-600"
                }`}
              >
                {onboardedPercentage}%
              </div>
            </div>
            <div className="text-md font-bold mt-2 text-center">
              ON-BOARDING COMPLETE
            </div>
          </div>

          {/* CENTER COUNT */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-black">
              {onboardedCount}
            </div>
            <div className="text-lg font-bold text-black">
              TOTAL
              <br />
              ON-BOARDED
            </div>
          </div>

          {/* RIGHT GRAPH - ONBOARDING INCOMPLETE */}
          <div className="flex flex-col items-center w-[300px]">
            <div className="relative w-[260px] h-[160px]">
              <svg
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                viewBox="-10 10 120 20"
              >
                {/* Background Arc */}

                <path
                  d="M0,50 A50,50 0 0,1 100,50"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="14"
                />
                {/* Foreground Arc (Dynamic) */}
                <path
                  d="M0,50 A50,50 0 0,1 100,50"
                  fill="none"
                  stroke="#000"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * incompletePercentage) / 100}
                  style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                />
              </svg>
              {/* Percentage Text */}
              <div
                className={`absolute top-[76%] left-[45%] font-bold text-xl ${
                  incompletePercentage >= 75
                    ? "text-green-600"
                    : incompletePercentage >= 50
                    ? "text-orange-500"
                    : "text-red-600"
                }`}
              >
                {incompletePercentage}%
              </div>
            </div>
            <div className="text-md font-bold mt-2 text-center">
              ON-BOARDING INCOMPLETE
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {/* ACTION BUTTONS */}
          <div className="absolute top-4 right-6 flex gap-2">
            <button
              onClick={handleOpen}
              className="bg-black text-white font-bold px-4 py-2 rounded-full"
            >
              + ADD CANDIDATE
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          {loading ? (
            <div className="text-center p-6 text-lg">Loading...</div>
          ) : (
            <table className="min-w-full bg-white text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-center">
                  {[
                    ["#", ""],
                    ["candidate_name", "NAME"],
                    ["email", "EMAIL"],
                    ["contact_no", "CONTACT"],
                    ["whatsapp_no", "WHATSAPP"],
                    ["date_of_joining", "DOJ"],
                    ["profile_type", "PROFILE"],
                    ["status", "STATUS"],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {label}
                    </th>
                  ))}
                  <th className="px-4 py-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((c, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      c.status === "onboarded"
                        ? "bg-green-100"
                        : c.status === "rejected"
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <td className="border px-2 py-1">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="border px-2 py-1">{c.candidate_name}</td>
                    <td className="border px-2 py-1">{c.email}</td>
                    <td className="border px-2 py-1">{c.contact_no}</td>
                    <td className="border px-2 py-1">{c.whatsapp_no}</td>
                    <td className="border px-2 py-1">
                      {c.date_of_joining?.slice(0, 10)}
                    </td>
                    <td className="border px-2 py-1">{c.profile_type}</td>
                    <td className="border px-2 py-1">
                      <div>{c.status}</div>
                      {c.status === "onboarded" && c.onboardedAt && (
                        <div className="text-xs text-red-600">
                          Auto-delete in {getRemainingDays(c.onboardedAt)}{" "}
                          day(s)
                        </div>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusUpdate(c._id, e.target.value)
                        }
                        className="bg-gray-200 p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="onboarded">Onboarded</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-black text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] relative p-6">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">ADD CANDIDATE</h2>
            {message && <p className="mb-2 text-blue-600">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                ["candidate_name", "NAME"],
                ["email", "EMAIL ADDRESS"],
                ["contact_no", "CONTACT NO."],
                ["whatsapp_no", "WHATSAPP NO."],
                ["date_of_joining", "DATE OF JOINING", "date"],
                ["profile_type", "PROFILE TYPE"],
              ].map(([name, label, type = "text"]) => (
                <div key={name} className="flex">
                  <label className="w-1/3 font-bold">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-2/3 p-2 rounded border"
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
                >
                  {loading ? "Saving..." : "SAVE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCandidate;
