import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TrainingCertificate from "./VerifyTraining";
import InternshipCertificate from "./VerifyInternship";
import logo from "./logo.png";

export default function VerifyCertificate() {
  const { id } = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState(0);

  const navItems = [
    "For Individuals",
    "For Businesses",
    "For Universities",
    "For Governments",
  ];

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const [res] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/salestask/certificate/training/${id}`
          ),
          new Promise((resolve) => setTimeout(resolve, 1000)), // 1 seconds delay
        ]);
        setCertificateData(res.data[0]);
      } catch (err) {
        console.error("Error fetching certificate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-gray-600">Loading certificate, please wait...</p>
      </div>
    );

  if (!certificateData)
    return <div className="p-6 text-center">Certificate not found.</div>;

  return (
    <div className="w-full">
      {/* Top Navbar */}
      <div className="bg-black text-white py-4 px-[5vw] flex gap-5">
        {navItems.map((item, idx) => (
          <a
            href="#"
            key={item}
            className={`font-semibold text-base no-underline ${
              activeNav === idx ? "border-b-4 border-white pb-1" : ""
            }`}
            onClick={() => setActiveNav(idx)}
          >
            {item}
          </a>
        ))}
      </div>

      {/* White Navbar */}
      <div className="flex justify-between items-center py-4 px-5 border-b border-gray-300">
        <img src={logo} alt="NLEARN Logo" className="h-10 w-auto" />
        <div className="flex gap-2">
          <button className="bg-gray-100 px-3 py-1 rounded">Explore</button>
          <input
            type="text"
            placeholder="What do you want to learn ?"
            className="px-3 py-1 w-[250px] border rounded"
          />
          <button className="bg-gray-100 px-3 py-1 rounded">🔍</button>
        </div>
        <div className="flex items-center">
          <a href="#" className="ml-3">
            Careers
          </a>
          <a href="#" className="ml-3">
            Log In
          </a>
          <button className="ml-3 bg-blue-600 text-white px-3 py-1 rounded">
            Join for Free
          </button>
        </div>
      </div>

      {/* Certificate Info Section */}
      <div className="w-screen mt-8 px-[5vw] box-border">
        <h3 className="text-lg font-medium">Program Certificate</h3>
        <h1 className="text-2xl font-bold mt-1">
          Specialization in {certificateData.domain_interested}
        </h1>

        <div className="flex flex-wrap gap-5 mt-5">
          {/* Left */}
          <div className="bg-blue-100 rounded-lg p-5 flex gap-4 w-full md:w-[60%]">
            <img
              src={certificateData.upload_image}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h4 className="m-0 font-semibold text-lg">
                Training Completed by {certificateData.customer_name}
              </h4>
              <p>
                {new Date(
                  certificateData.certificate_issued_on
                ).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>
                  {certificateData.hours || "30 hours (approximately)"}
                </strong>
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {certificateData.customer_name}'s account is verified. N-Learn
                certifies their successful completion of{" "}
                <strong>{certificateData.domain_interested}</strong> training.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="w-full md:w-[35%]">
            <img src="/src/hat-logo.png" alt="logo" className="w-10" />
            <h4 className="text-2xl font-bold mt-1">
              Specialization in {certificateData.domain_interested}
            </h4>

            <p className="flex items-center gap-2 mt-1">
              Powered by{" "}
              <img
                src="/src/gcloud.png"
                alt="Google Cloud"
                className="inline w-20 align-middle"
              />
            </p>
            <p>⭐ 4.7 (592 ratings)</p>
            <p>👨‍🎓 220 Students Enrolled</p>
          </div>
        </div>

        {/* Training Certificate Section */}
        <p className="mt-8 text-gray-800">
          You’ve successfully completed your training —{" "}
          <strong>verified by N-Learn</strong>, powered by{" "}
          <strong>Google Cloud</strong>, and certified by{" "}
          <strong>Navikshaa Technologies</strong>. You are now a{" "}
          <strong>Navikshaa Certified Skilled Student</strong>, equipped with
          industry-ready skills.
        </p>

        <div className="my-5 text-center">
          <TrainingCertificate
            training_certificate_id={certificateData.training_certificate_id}
          />
        </div>

        {/* Internship Info Text */}
        <p className="mt-8 text-gray-800">
          {certificateData.internship_certificate_id ? (
            <>
              You’ve successfully completed your internship with Navikshaa
              Technologies. Share your Internship Completion Certificate,{" "}
              <strong>verified by N-Learn</strong> and{" "}
              <strong>powered by Google Cloud</strong>.
            </>
          ) : (
            <>
              Your internship with <strong>Navikshaa Technologies</strong> is
              still in progress. Complete all required tasks to unlock your
              Internship Completion Certificate,{" "}
              <strong>verified by N-Learn</strong> and{" "}
              <strong>powered by Google Cloud</strong>.
            </>
          )}
        </p>

        {/* Internship Certificate Section */}
        <div className="my-5 text-center">
          <InternshipCertificate
            internship_certificate_id={
              certificateData.internship_certificate_id
            }
          />
        </div>
      </div>
    </div>
  );
}
