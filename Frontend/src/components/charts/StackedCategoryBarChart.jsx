import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StackedCategoryBarChart({ transactions }) {

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyCategoryTotals = {};
    const categories = [];

    transactions.forEach(txn => {
        if (txn.type === 'expense') {
            const month = new Date(txn.date).toLocaleString('default', { month: 'short' });
            const category = txn.category;

            if (!categories.includes(category)) {
                categories.push(category);
            }
            if (!monthlyCategoryTotals[month]) {
                monthlyCategoryTotals[month] = {};
            }

            monthlyCategoryTotals[month][category] = (monthlyCategoryTotals[month][category] || 0) + txn.amount;
        }
    });

    const labels = Object.keys(monthlyCategoryTotals).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    const borderColors = [
        'rgba(255, 99, 132, 1)',     // Red
        'rgba(54, 162, 235, 1)',     // Blue
        'rgba(255, 206, 86, 1)',     // Yellow
        'rgba(75, 192, 192, 1)',     // Teal
        'rgba(153, 102, 255, 1)',    // Purple
        'rgba(255, 159, 64, 1)',     // Orange
        'rgba(199, 199, 199, 1)',    // Grey
        'rgba(100, 255, 218, 1)',    // Aqua
        'rgba(255, 102, 255, 1)',    // Pink
        'rgba(160, 160, 255, 1)',    // Light Blue
        'rgba(0, 200, 83, 1)',       // Green
        'rgba(255, 112, 67, 1)'      // Deep Orange
    ];

    const colors = [
        'rgba(255, 99, 132, 0.6)',    // Red
        'rgba(54, 162, 235, 0.6)',    // Blue
        'rgba(255, 206, 86, 0.6)',    // Yellow
        'rgba(75, 192, 192, 0.6)',    // Teal
        'rgba(153, 102, 255, 0.6)',   // Purple
        'rgba(255, 159, 64, 0.6)',    // Orange
        'rgba(199, 199, 199, 0.6)',   // Grey
        'rgba(100, 255, 218, 0.6)',   // Aqua
        'rgba(255, 102, 255, 0.6)',   // Pink
        'rgba(160, 160, 255, 0.6)',   // Light Blue
        'rgba(0, 200, 83, 0.6)',      // Green
        'rgba(255, 112, 67, 0.6)'     // Deep Orange
    ];

    const datasets = categories.map((cat, index) => ({
        label: cat,
        data: labels.map(month => monthlyCategoryTotals[month][cat] || 0),
        backgroundColor: colors[index % colors.length], // For out of bounds categories
        stack: "stack1",
        borderColor: borderColors[index % borderColors.length]
    }));

    const data = {
        labels,
        datasets
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            },
            tooltip: {
                mode: "index",
                intersect: false
            }
        },
        interaction: {
            mode: "index",
            intersect: false
        },
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">
                Category-wise Monthly Expenses (Stacked)
            </h3>
            <Bar data={data} options={options} />
        </div>
    );
}
