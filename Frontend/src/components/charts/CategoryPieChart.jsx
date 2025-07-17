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
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(100, 255, 218, 0.6)'
                ],
                hoverOffset: 4
            }],
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">Category Expenses</h3>
            <Pie data={data} />
        </div>
    );
}