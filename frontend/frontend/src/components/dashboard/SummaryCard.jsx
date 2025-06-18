import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${color} text-white text-2xl`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{text}</p>
        <p className="text-2xl font-bold text-gray-800">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
