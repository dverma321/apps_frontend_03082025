import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import './Chart.css';

const MonthlyExpenseChart = ({ allEntries }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!allEntries || Object.keys(allEntries).length === 0) return;

    const monthlyData = {};

    Object.keys(allEntries).forEach((date) => {
      const month = date.slice(0, 7);
      allEntries[date].forEach((entry) => {
        if (entry.price && typeof entry.price === "number") {
          const detail = entry.details || "Other";
          if (!monthlyData[month]) monthlyData[month] = {};
          monthlyData[month][detail] = (monthlyData[month][detail] || 0) + entry.price;
        }
      });
    });

    const detailTypes = [...new Set(Object.values(monthlyData).flatMap((month) => Object.keys(month)))];
    const labels = Object.keys(monthlyData).sort();
    const datasets = detailTypes.map((detail, index) => ({
      label: detail,
      data: labels.map((month) => monthlyData[month][detail] || 0),
      backgroundColor: getColor(index),
      borderColor: getColor(index),
      borderWidth: 1,
      barPercentage: 0.4, // Adjust bar width for better visibility
      categoryPercentage: 0.7,
    }));

    setChartData({ labels, datasets });
  }, [allEntries]);

  const getColor = (index) => {
    const colors = ["#36a2eb", "#ff6384", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"];
    return colors[index % colors.length];
  };

  return (
    <div className="mainDivContainerForChart">
      <h3 style={{ textAlign: "center" }}>Monthly Expenditure Analysis</h3>
      {chartData ? (
        <div className="mainChart">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }, // Hide legend above bars
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const category = tooltipItem.dataset.label;
                      const value = tooltipItem.raw;
                      return `${category}: ₹ ${value}`;
                    },
                  },
                },
              },
              scales: {
                x: { stacked: true, ticks: { autoSkip: false } },
                y: { stacked: true, title: { display: true, text: "Amount (₹)" } },
              },
            }}
          />
          <div className="mainLabelContainer">
            {chartData.datasets.map((dataset, index) => (
              <div key={index} className="categoryLabel">
               
                <div className="labelColorBox" style={{  backgroundColor: dataset.backgroundColor }}></div>
                <span>{dataset.label}: ₹{dataset.data.reduce((a, b) => a + b, 0)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No data available</p>
      )}
    </div>
  );
};

export default MonthlyExpenseChart;