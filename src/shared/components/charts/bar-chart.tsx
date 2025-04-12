import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "./bar-chart.scss";

ChartJS.register(...registerables);

interface BarChartCardProps {
  data: Array<{ x: string; y: number }>;
  options?: any; 
}

const BarChartCard: React.FC<BarChartCardProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.x),
    datasets: [
      {
        label: "Number of Students",
        data: data.map((item) => item.y),
        backgroundColor: "rgba(248, 49, 9, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius:5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bar-chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartCard;