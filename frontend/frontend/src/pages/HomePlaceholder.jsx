// src/pages/HomePlaceholder.jsx
import React from "react";

const HomePlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600">
      <img
        src="https://cdn-icons-png.flaticon.com/512/6394/6394650.png"
        alt="Placeholder"
        className="w-40 h-40 mb-6 opacity-60"
      />
      <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
      <p className="text-center max-w-md">
        Select a group, start a new chat, or go to settings from the sidebar.
      </p>
    </div>
  );
};

export default HomePlaceholder;
