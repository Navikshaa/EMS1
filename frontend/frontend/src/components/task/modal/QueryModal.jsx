import React from "react";

const QueryModal = ({ isOpen, onClose, onSend, queryText, setQueryText }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-lg shadow-lg w-96 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          ✖️
        </button>

        <h3 className="text-lg font-bold mb-4">Queries</h3>

        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-12 resize-none max-h-50 overflow-y-auto"
          rows={5}
          maxLength={1000}
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Enter your queries here..."
        />

        <button
          className="absolute bottom-1 right-5  mb-2 bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
          onClick={onSend}
        >
          Request For Queries
        </button>
      </div>
    </div>
  );
};

export default QueryModal;
