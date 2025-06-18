import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";

const MarketTable = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user || !user.name) return;

    const employeeName = encodeURIComponent(user.name);

    const fetchData = () => {
      fetch(
        `http://localhost:3000/api/salestask/marketed-from/${employeeName}`
      ),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
          .then((res) => res.json())
          .then(setSalesData)
          .catch((err) => console.error("Fetch failed:", err));
    };

    fetchData(); // initial fetch

    const interval = setInterval(fetchData, 30000); // refresh every 30s

    return () => clearInterval(interval); // cleanup
  }, [user]);

  const filteredData = salesData.filter((item) =>
    (item.customer_name || "").toLowerCase().includes(searchName.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const columns = [
    { label: "SL No.", width: 80 },
    { label: "Name", key: "customer_name", width: 160 },
    { label: "Email", key: "email", width: 220 },
    { label: "Contact No", key: "contact_no", width: 140 },
    { label: "Domain Interested", key: "domain_interested", width: 180 },
    { label: "Ticket Size", key: "ticket_size", width: 140 },
    { label: "Program Type", key: "program_type", width: 160 },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <div
        className="max-w-full bg-white rounded-lg border border-gray-300 w-full"
        style={{ maxWidth: "1200px" }}
      >
        {/* Search Bar */}
        <div className="border-b border-gray-300 px-4 py-3 flex flex-col sm:flex-row gap-3">
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[480px]">
          <table
            className="w-full border-collapse"
            style={{ minWidth: "1000px" }}
          >
            <thead>
              <tr>
                {columns.map(({ label, width }) => (
                  <th
                    key={label}
                    style={{
                      width,
                      minWidth: width,
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#2563EB",
                      color: "white",
                      border: "1px solid #1E40AF",
                      zIndex: 10,
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-600"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB",
                    }}
                  >
                    <td style={centerCellStyle(columns[0].width)}>
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td style={cellStyle(columns[1].width)}>
                      {item.customer_name || "-"}
                    </td>
                    <td style={cellStyle(columns[2].width)}>
                      {item.email || "-"}
                    </td>
                    <td style={centerCellStyle(columns[3].width)}>
                      {item.contact_no || "-"}
                    </td>
                    <td style={cellStyle(columns[4].width)}>
                      {item.domain_interested || "-"}
                    </td>
                    <td style={centerCellStyle(columns[5].width)}>
                      {item.ticket_size || "-"}
                    </td>
                    <td style={cellStyle(columns[6].width)}>
                      {item.program_type || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t px-4 py-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => handlePageChange(num + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === num + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const cellStyle = (width) => ({
  width,
  minWidth: width,
  padding: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const centerCellStyle = (width) => ({
  ...cellStyle(width),
  textAlign: "center",
});

export default MarketTable;
