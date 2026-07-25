import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const moodValueMap = {
  happy: 4,
  calm: 3,
  stressed: 2,
  sad: 1,
};

const moodLabelMap = {
  4: 'Happy 😊',
  3: 'Calm 😌',
  2: 'Stressed 😰',
  1: 'Sad 😢',
};

const MoodChart = ({ history = [] }) => {
  // Sort chronologically ascending for line chart
  const sorted = [...history].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const labels = sorted.map((item) =>
    new Date(item.created_at).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    })
  );

  const dataValues = sorted.map(
    (item) => moodValueMap[item.mood?.toLowerCase()] || 2
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Emotional State',
        data: dataValues,
        borderColor: '#60a5fa',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
          return gradient;
        },
        pointBackgroundColor: '#93c5fd',
        pointBorderColor: '#1e3a8a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(13, 17, 23, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#93c5fd',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return ` Mood: ${moodLabelMap[val] || 'Unknown'}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0.5,
        max: 4.5,
        ticks: {
          stepSize: 1,
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          callback: (value) => moodLabelMap[value] || '',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-64 sm:h-72 w-full pt-2">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MoodChart;
