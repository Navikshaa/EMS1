import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { FaLock } from "react-icons/fa";
import templateImage from "../../assets/templates/internship_template.jpg";

const InternshipCertificate = ({ internship_certificate_id }) => {
  const [data, setData] = useState(null);
  const certificateRef = useRef();
  const isLocked = !internship_certificate_id;

  useEffect(() => {
    if (internship_certificate_id) {
      fetch(
        `http://localhost:3000/api/salestask/certificate/internship/${internship_certificate_id}`
      )
        .then((res) => res.json())
        .then((res) => setData(res[0]))
        .catch((err) =>
          console.error("Error loading internship certificate:", err)
        );
    }
  }, [internship_certificate_id]);

  const verifyUrl = data?.internship_certificate_id
    ? `https://localhost:5173/verify/${data.internship_certificate_id}`
    : "";

  const downloadAsImage = async () => {
    const element = document.getElementById("internship-certificate-container");
    element.scrollIntoView();
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
    });
    const dataUrl = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${data.customer_name}-Internship-Certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderLockedButton = (label) => (
    <div className="relative">
      <button
        className="px-4 py-2 border border-gray-300 rounded-md bg-white blur-[4px] opacity-70 cursor-not-allowed"
        disabled
      >
        {label}
      </button>
      <FaLock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-xl" />
    </div>
  );

  const renderButtons = () => {
    if (isLocked) {
      return (
        <div className="flex flex-col gap-4 mt-12 w-fit">
          {renderLockedButton("Share on LinkedIn")}
          {renderLockedButton("Download Image")}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4 mt-12 w-fit">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          onClick={() =>
            window.open(
              "https://www.linkedin.com/sharing/share-offsite/?url=" +
                verifyUrl,
              "_blank"
            )
          }
        >
          Share on LinkedIn
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          onClick={downloadAsImage}
        >
          Download Image
        </button>
      </div>
    );
  };

  const renderLockedCertificate = () => (
    <div className="relative w-[842px] h-[595px] mt-10">
      <div className="blur-[4px] opacity-70">
        <img
          src={templateImage}
          alt="Locked Internship Template"
          className="w-full h-full object-cover rounded"
        />
      </div>
      <FaLock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-6xl" />
    </div>
  );

  if (isLocked) {
    return (
      <div className="flex justify-center items-start gap-6 mt-10">
        {renderButtons()}
        {renderLockedCertificate()}
      </div>
    );
  }

  if (!data) return <div>Loading...</div>;

  const {
    customer_name,
    domain_interested,
    internship_period,
    internship_date_range,
    internship_certificate_id: id,
    upload_image,
  } = data;

  return (
    <div className="flex justify-center items-start gap-6 mt-10">
      {renderButtons()}

      <div
        id="internship-certificate-container"
        ref={certificateRef}
        className="relative w-[842px] h-[595px] font-sans border shadow bg-white"
      >
        <img
          src={templateImage}
          alt="Internship Certificate Template"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-[180px] left-[27px] text-[24px] font-bold">
          {customer_name}
        </div>
        <div className="absolute top-[260px] left-[27px] text-[20px] font-bold text-blue-700">
          {domain_interested}
        </div>
        <div className="absolute top-[382px] left-[220px] text-[16px] font-semibold">
          {internship_period}
        </div>
        <div className="absolute top-[385px] left-[200px] text-[14px]">
          {internship_date_range}
        </div>
        <div className="absolute top-[515px] left-[120px] text-[13px] text-gray-600">
          {id}
        </div>
        <div className="absolute top-[550px] left-[10px] text-[12px] text-blue-600">
          {verifyUrl}
        </div>

        {/* QR Code */}
        <div className="absolute bottom-[8px] right-[19px] bg-white p-[5px] rounded">
          <QRCode value={verifyUrl} size={60} />
        </div>

        {/* Upload Image */}
        {upload_image && (
          <div
            className="absolute"
            style={{
              left: "680px",
              top: "160px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #000",
            }}
          >
            <img
              src={
                upload_image.startsWith("http")
                  ? upload_image
                  : `http://localhost:3000/${upload_image}`
              }
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipCertificate;
