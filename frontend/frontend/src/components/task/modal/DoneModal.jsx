import React from "react";

const DoneModal = ({
  isOpen,
  onClose,
  doneMessage,
  setDoneMessage,
  doneImagePreview,
  handleDoneImageChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-100 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          ✖️
        </button>

        <h3 className="text-lg font-bold mb-4">Done</h3>

        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-2 resize-none"
          rows={7}
          value={doneMessage}
          onChange={(e) => setDoneMessage(e.target.value)}
          placeholder="Completion message..."
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleDoneImageChange}
          className="mb-3 mt-3"
        />
        {doneImagePreview && (
          <img
            src={doneImagePreview}
            alt="Preview"
            className="w-full h-40 object-contain border rounded"
          />
        )}

        <button
          className="absolute bottom-2 right-5 bg-gray-500  text-white px-6 py-2 rounded mb-2 mt-4 hover:bg-gray-700"
          onClick={onSubmit}
        >
          Task Done
        </button>
      </div>
    </div>
  );
};

export default DoneModal;
