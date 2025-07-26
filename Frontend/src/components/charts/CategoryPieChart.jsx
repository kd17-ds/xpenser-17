import React from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ transactions }) {

    const categoryTotals = {};

    transactions.forEach(txn => {
        if (txn.type === 'expense') {
            const category = txn.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]) // sorts categories in descending order
    const labels = sortedCategories.map(([cat]) => cat); // It takes the first index category
    const values = sortedCategories.map(([_, amount]) => amount); // it leaves category and maps amount
    const data = {
        labels,
        datasets: [
            {
                label: 'Expenses (₹)',
                data: values,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.75)',     // Blue
                    'rgba(16, 185, 129, 0.75)',     // Green
                    'rgba(234, 179, 8, 0.75)',      // Yellow
                    'rgba(239, 68, 68, 0.75)',      // Red
                    'rgba(107, 114, 128, 0.75)',    // Gray
                    'rgba(99, 102, 241, 0.75)',     // Indigo
                    'rgba(236, 72, 153, 0.75)',     // Pink
                    'rgba(20, 184, 166, 0.75)',     // Teal
                ],
                hoverOffset: 4
            }],
    };
    const options = {
        plugins: {
            legend: { position: "left" },
        },
    };


    return (
        <div className="w-full px-4 sm:px-0">
            <div className="max-w-md sm:max-w-2xl mx-auto">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
}