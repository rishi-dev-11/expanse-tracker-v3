import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ExpenseChart = ({ data }) => {
  const chartRef = useRef(null); // canvas reference
  const chartInstanceRef = useRef(null); // Chart.js instance reference

  useEffect(() => {
    // Guard: if data is missing or empty
    if (!data || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((item) => item.category),
        datasets: [
          {
            label: 'Expenses',
            data: data.map((item) => item.amount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  // Fallback UI when no data
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available to display the chart.</p>;
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ExpenseChart;
