// components/SalaryChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalaryChart = ({ data }) => {
  const chartData = {
    labels: data?.map((item) => item.label), // e.g., months or departments
    datasets: [
      {
        label: 'Salary (₹)',
        data: data?.map((item) => item.salary),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Salary Distribution' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalaryChart;
