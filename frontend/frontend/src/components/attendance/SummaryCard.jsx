import React from "react";

const SummaryCard = ({ icon, text, number, color = "#cddbf6" }) => {
  return (
    <div
      className="w-42 h-34 rounded-2xl flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundColor: color,
        boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="text-4xl text-black mt-0.5 mb-8">{icon}</div>
      <p className="text-gray-600 text-sm">{text}</p>
      <p className="text-gray-900 text-2xl font-bold mb-4">{number}</p>
    </div>
  );
};

export default SummaryCard;
