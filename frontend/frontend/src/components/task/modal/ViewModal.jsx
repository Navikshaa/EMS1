import React from "react";

const ViewModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task || !task.initial_image) return null;

  const imageUrl = `http://localhost:3000/uploads/${task.initial_image}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
        <img
          src={imageUrl}
          alt="Task"
          className="w-full h-auto object-contain rounded"
        />

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewModal;
