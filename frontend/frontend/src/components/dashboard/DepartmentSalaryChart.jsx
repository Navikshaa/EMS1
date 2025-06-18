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

const DepartmentSalaryChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.department),
    datasets: [
      {
        label: 'Total Salary',
        data: data.map(item => item.totalSalary),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Avg Salary',
        data: data.map(item => item.avgSalary),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Employees Paid',
        data: data.map(item => item.employeeCount),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Department-wise Salary Overview',
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `₹${val.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DepartmentSalaryChart;
