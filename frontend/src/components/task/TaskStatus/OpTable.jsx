import React, { useState, useEffect, useRef } from "react";
import { PiCertificateBold } from "react-icons/pi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LiaCertificateSolid } from "react-icons/lia";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";

const OpTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef({});
  const itemsPerPage = 10;

  const [clicked, setClicked] = useState(() => {
    const saved = localStorage.getItem("clickedButtons");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    localStorage.setItem("clickedButtons", JSON.stringify(clicked));
  }, [clicked]);

  const fetchSalesData = () => {
    fetch("http://localhost:3000/api/salestask")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const enrichedData = data.map((item) => ({
          ...item,
          image_url: item.upload_image || null,
        }));
        setSalesData(enrichedData);
      })
      .catch((err) => console.error("Fetch failed:", err));
  };

  const handleUploadClick = (id) => {
    if (fileInputRef.current[id]) {
      fileInputRef.current[id].click();
    }
  };

  const handleFileChange = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("id", id);

      const res = await fetch(
        "http://localhost:3000/api/salestask/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();
      const updatedData = salesData.map((item) =>
        item._id === id
          ? { ...item, image_url: result.upload_image || null }
          : item
      );

      setSalesData(updatedData);
      alert("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/salestask/delete-image/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Delete failed");

      const updatedData = salesData.map((item) =>
        item._id === id ? { ...item, image_url: null } : item
      );
      setSalesData(updatedData);
      alert("Image deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image");
    }
  };

  const markClicked = (id, key, value) => {
    setClicked((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: true,
        certificateId: value,
      },
    }));
  };

  const [certificatePopup, setCertificatePopup] = useState({
    visible: false,
    certificateId: "",
  });

  const showCertificatePopup = (certId) => {
    setCertificatePopup({
      visible: true,
      certificateId: certId,
    });
  };

  const handleDownloadCertificate = async (id, name, certificateId) => {
    if (certificateId) {
      showCertificatePopup(certificateId);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/certificate/generate/${id}`
      );

      if (!response.ok) throw new Error("Failed to generate certificate");

      const blob = await response.blob();
      const certId = response.headers.get("x-certificate-id") || "Unknown";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      markClicked(id, "certificate", certId);
      showCertificatePopup(certId); // ✅ show modal
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading certificate");
    }
  };

  const handleDownloadInternshipCertificate = async (
    id,
    name,
    certificateId
  ) => {
    if (certificateId) {
      // Already generated – show popup with ID
      showCertificatePopup(certificateId);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/internships/generate/${id}`
      );

      if (!response.ok)
        throw new Error("Failed to generate internship certificate");

      // 🧠 Extract certificate ID from response headers (same as training logic)
      const certId = response.headers.get("x-certificate-id") || "Unknown";

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_internship_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      markClicked(id, "internship", certId); // ✅ Save to state
      showCertificatePopup(certId); // ✅ Show modal popup
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading internship certificate");
    }
  };

  const handleDownloadOfferLetter = async (id, name) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/offer-letter/generate/${id}`
      );
      if (!response.ok) throw new Error("Failed to generate offer letter");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_offer_letter.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      markClicked(id, "offer");
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading offer letter");
    }
  };

  const handleMarkAsDone = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/salestask/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "partial_done" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const updatedItem = await response.json();
      const updatedData = salesData.map((item) =>
        item._id === id ? { ...item, status: updatedItem.status } : item
      );
      setSalesData(updatedData);
      markClicked(id, "partial_done");
      alert("Status updated to done");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to mark as done");
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
    { label: "PROGRAM TYPE", width: 180, key: "program_type" },
    {
      label: "INTERNSHIP START DATE",
      width: 180,
      key: "internship_start_date",
    },
    { label: "INTERNSHIP END DATE", width: 180, key: "internship_end_date" },
    { label: "", width: 200, key: "actions", sticky: true },
  ];

  return (
    <div className="p-4 bg-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1200px] bg-white rounded-lg">
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
                    <td className="text-center p-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    {columns.slice(1, -1).map(({ key }) => {
                      let value = item[key];
                      if (
                        (key === "internship_start_date" ||
                          key === "internship_end_date") &&
                        value
                      ) {
                        value = new Date(value).toLocaleDateString("en-IN");
                      }
                      return (
                        <td key={key} className="p-2 truncate">
                          {value || "-"}
                        </td>
                      );
                    })}
                    <td className="sticky right-0 bg-gray-100 p-2 z-10">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRef.current[item._id] = el)}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, item._id)}
                        />

                        <div className="relative">
                          <button
                            onClick={() => handleUploadClick(item._id)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-gray-800 overflow-hidden"
                            title="Upload Image"
                          >
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt="uploaded"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <FaCloudUploadAlt size={18} />
                            )}
                          </button>
                          {item.image_url && (
                            <button
                              onClick={() => handleDeleteImage(item._id)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-800"
                              title="Remove Image"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleDownloadCertificate(
                              item._id,
                              item.customer_name,
                              item.training_certificate_id
                            )
                          }
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            clicked[item._id]?.certificate
                              ? "bg-yellow-300"
                              : "bg-gray-600 hover:bg-gray-800 text-white"
                          }`}
                          title={
                            clicked[item._id]?.certificate
                              ? `Certificate ID: ${
                                  clicked[item._id]?.certificateId ||
                                  "Already Generated"
                                }`
                              : "Download Certificate"
                          }
                        >
                          <PiCertificateBold size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDownloadInternshipCertificate(
                              item._id,
                              item.customer_name,
                              item.internship_certificate_id
                            )
                          }
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            clicked[item._id]?.internship
                              ? "bg-yellow-300"
                              : "bg-gray-600 hover:bg-gray-800 text-white"
                          }`}
                          title={
                            clicked[item._id]?.internship
                              ? `Internship Certificate ID: ${
                                  clicked[item._id]?.certificateId ||
                                  "Already Generated"
                                }`
                              : "Download Internship Certificate"
                          }
                        >
                          <LiaCertificateSolid size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDownloadOfferLetter(
                              item._id,
                              item.customer_name
                            )
                          }
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            clicked[item._id]?.offer
                              ? "bg-yellow-300 cursor-not-allowed"
                              : "bg-gray-600 hover:bg-gray-800 text-white"
                          }`}
                          title="Download Offer Letter"
                          disabled={clicked[item._id]?.offer}
                        >
                          <HiOutlineDocumentDownload size={18} />
                        </button>

                        <button
                          onClick={() => handleMarkAsDone(item._id)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            clicked[item._id]?.partial_done
                              ? "bg-yellow-300 cursor-not-allowed"
                              : "bg-gray-600 hover:bg-gray-800 text-white"
                          }`}
                          title="Mark as Done"
                          disabled={clicked[item._id]?.partial_done}
                        >
                          <FaCheckCircle size={18} />
                        </button>
                      </div>
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

      {certificatePopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative">
            <h2 className="text-lg font-semibold mb-3">
              🎓 Certificate Generated
            </h2>
            <p className="mb-2 text-gray-700">
              Certificate ID:
              <span className="font-mono block text-blue-700 mt-1">
                {certificatePopup.certificateId}
              </span>
            </p>
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              onClick={() => {
                navigator.clipboard.writeText(certificatePopup.certificateId);
              }}
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={() =>
                setCertificatePopup({ visible: false, certificateId: "" })
              }
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpTable;
