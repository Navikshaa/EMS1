import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";

const SalesTable = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (!user || !user.name) return;
    fetchSalesData();
  }, [user]);

  const fetchSalesData = () => {
    const employeeName = encodeURIComponent(user.name);
    fetch(`http://localhost:3000/api/salestask/name/${employeeName}`)
      .then((res) => res.json())
      .then(setSalesData)
      .catch((err) => console.error("Fetch failed:", err));
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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(
        `http://localhost:3000/api/salestask/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        {
          method: "DELETE",
        }
      );
      fetchSalesData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(
        `http://localhost:3000/api/salestask/${selectedItem._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedItem),
        }
      );
      fetchSalesData();
      setShowModal(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const columns = [
    { label: "Customer Name", width: 140 },
    { label: "Email", width: 220 },
    { label: "Contact No", width: 140 },
    { label: "WhatsApp No", width: 140 },
    { label: "Ticket Size", width: 110 },
    { label: "Registration Amount", width: 180 },
    { label: "Pending Amount", width: 160 },
    { label: "Pending Date", width: 160 },
    { label: "Program Type", width: 160 },
    { label: "Internship Start", width: 180 },
    { label: "Internship End", width: 180 },
    { label: "Marketed From", width: 160 },
    { label: "Domain Interested", width: 160 },
    { label: "Action", width: 180 },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <div
        className="max-w-full bg-white rounded-lg border border-gray-300 w-full"
        style={{ maxWidth: "1200px" }}
      >
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

        <div className="overflow-x-auto max-h-[480px]">
          <table
            className="w-full border-collapse"
            style={{ minWidth: "1200px" }}
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
                    <td style={cellStyle(columns[0].width)}>
                      {item.customer_name || "-"}
                    </td>
                    <td style={cellStyle(columns[1].width)}>
                      {item.email || "-"}
                    </td>
                    <td style={centerCellStyle(columns[2].width)}>
                      {item.contact_no || "-"}
                    </td>
                    <td style={centerCellStyle(columns[3].width)}>
                      {item.whatsapp_no || "-"}
                    </td>
                    <td style={centerCellStyle(columns[4].width)}>
                      {item.ticket_size || "-"}
                    </td>
                    <td style={centerCellStyle(columns[5].width)}>
                      {item.registration_amount || "-"}
                    </td>
                    <td style={centerCellStyle(columns[6].width)}>
                      {item.pending_amount || "-"}
                    </td>
                    <td style={centerCellStyle(columns[7].width)}>
                      {item.pending_date
                        ? new Date(item.pending_date).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                    <td style={cellStyle(columns[8].width)}>
                      {item.program_type || "-"}
                    </td>
                    <td style={centerCellStyle(columns[9].width)}>
                      {item.internship_start_date
                        ? new Date(
                            item.internship_start_date
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td style={centerCellStyle(columns[10].width)}>
                      {item.internship_end_date
                        ? new Date(item.internship_end_date).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                    <td style={cellStyle(columns[11].width)}>
                      {item.marketed_from || "-"}
                    </td>
                    <td style={cellStyle(columns[12].width)}>
                      {item.domain_interested || "-"}
                    </td>
                    <td style={centerCellStyle(columns[13].width)}>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}
                        className="text-blue-600 underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-semibold mb-4">Edit Sales Data</h2>

            {[
              { label: "Customer Name", key: "customer_name" },
              { label: "Email", key: "email" },
              { label: "Contact No", key: "contact_no" },
              { label: "WhatsApp No", key: "whatsapp_no" },
              { label: "Ticket Size", key: "ticket_size" },
              { label: "Registration Amount", key: "registration_amount" },
              { label: "Pending Amount", key: "pending_amount" },
              { label: "Program Type", key: "program_type" },
              { label: "Marketed From", key: "marketed_from" },
              { label: "Domain Interested", key: "domain_interested" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={selectedItem[field.key] || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      [field.key]: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pending Date
              </label>
              <input
                type="date"
                value={
                  selectedItem.pending_date
                    ? new Date(selectedItem.pending_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    pending_date: new Date(e.target.value),
                  })
                }
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internship Start Date
              </label>
              <input
                type="date"
                value={
                  selectedItem.internship_start_date
                    ? new Date(selectedItem.internship_start_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    internship_start_date: new Date(e.target.value),
                  })
                }
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internship End Date
              </label>
              <input
                type="date"
                value={
                  selectedItem.internship_end_date
                    ? new Date(selectedItem.internship_end_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    internship_end_date: new Date(e.target.value),
                  })
                }
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Cell Styles
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

export default SalesTable;
