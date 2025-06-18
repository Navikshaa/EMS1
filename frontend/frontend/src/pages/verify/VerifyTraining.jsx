import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import templateImage from "../../assets/templates/training_template.jpg";

const TrainingCertificate = ({ training_certificate_id }) => {
  const [data, setData] = useState(null);

  // Fetch certificate data by ID
  useEffect(() => {
    fetch(
      `http://localhost:3000/api/salestask/certificate/training/${training_certificate_id}`
    )
      .then((res) => res.json())
      .then((res) => setData(res[0]))
      .catch((err) => console.error("Error loading certificate:", err));
  }, [training_certificate_id]);

  if (!data) return <div>Loading...</div>;

  const {
    customer_name,
    domain_interested,
    certificate_issued_on,
    training_certificate_id: id,
  } = data;

  // ✅ Replace with your hosted domain
  const verifyUrl = `https://localhost:5173/verify/${id}`;

  // 📸 Download the certificate div as image
  const downloadAsImage = async () => {
    const element = document.getElementById("certificate-container");

    // Scroll to element to ensure it's fully rendered
    element.scrollIntoView();

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2, // Higher quality
    });
    const dataUrl = canvas.toDataURL("image/jpeg");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${customer_name}-Certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerStyle = {
    position: "relative",
    width: "842px",
    height: "595px",
    fontFamily: "Helvetica, sans-serif",
    border: "1px solid #ccc",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fff",
  };

  const textBaseStyle = {
    position: "absolute",
    fontWeight: "bold",
    color: "#000",
  };

  return (
    <div className="flex justify-center items-start gap-6 mt-10">
      {/* Sidebar Actions */}
      <div className="flex flex-col gap-4 mt-12">
        {/* LinkedIn Share */}
        <a
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-white text-center"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${verifyUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on LinkedIn
        </a>

        {/* Download */}
        <button
          onClick={downloadAsImage}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-white"
        >
          Download Image
        </button>
      </div>

      {/* Certificate Content */}
      <div id="certificate-container" style={containerStyle}>
        <img
          src={templateImage}
          alt="Training Certificate Template"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Dynamic Certificate Fields */}
        <div
          style={{
            ...textBaseStyle,
            top: "180px",
            left: "27px",
            fontSize: "24px",
          }}
        >
          {customer_name}
        </div>
        <div
          style={{
            ...textBaseStyle,
            top: "260px",
            left: "27px",
            fontSize: "20px",
            color: "#0000cc",
          }}
        >
          {domain_interested}
        </div>
        <div
          style={{
            ...textBaseStyle,
            top: "382px",
            left: "220px",
            fontSize: "16px",
            color: "#333",
          }}
        >
          {certificate_issued_on}
        </div>
        <div
          style={{
            ...textBaseStyle,
            top: "515px",
            left: "120px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          {id}
        </div>
        <div
          style={{
            ...textBaseStyle,
            top: "550px",
            left: "10px",
            fontSize: "12px",
            color: "#3399ff",
          }}
        >
          {verifyUrl}
        </div>

        {/* QR Code */}
        <div
          style={{
            position: "absolute",
            right: "19px",
            bottom: "8px",
            background: "#fff",
            padding: "5px",
            borderRadius: "10%",
          }}
        >
          <QRCode value={verifyUrl} size={60} />
        </div>
      </div>
    </div>
  );
};

export default TrainingCertificate;
