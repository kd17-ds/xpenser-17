import React from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CategoryComparisonChart({ budget, transactions }) {
    if (!budget || !budget.categories || Object.keys(budget.categories).length === 0) {
        return (
            <div className="text-center text-gray-500 mt-4">
                No budget data available for this period.
            </div>
        );
    }

    const categories = Object.keys(budget.categories);
    const budgetAmounts = categories.map(cat => Number(budget.categories[cat] || 0));

    const expenseSums = {};
    transactions.forEach(txn => {
        if (txn.type === "expense") {
            expenseSums[txn.category] = (expenseSums[txn.category] || 0) + txn.amount;
        }
    });
    const expenseAmounts = categories.map(cat => expenseSums[cat] || 0);

    const data = {
        labels: categories,
        datasets: [
            {
                label: "Budget (₹)",
                data: budgetAmounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: "Expenses (₹)",
                data: expenseAmounts,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: `Category-wise Budget vs Expenses - ${budget.month} ${budget.year}`,
                font: { size: 18 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Amount (₹)",
                },
            },
        },
    };

    const insights = categories.map((cat, idx) => {
        const budgeted = budgetAmounts[idx];
        const spent = expenseAmounts[idx];
        const diff = spent - budgeted;

        if (diff > 0) return { type: "over", msg: `Overspent in ${cat} by ₹${diff.toFixed(2)}` };
        if (diff < 0) return { type: "under", msg: `Saved ₹${(-diff).toFixed(2)} in ${cat}` };
        return { type: "met", msg: `Met the budget in ${cat}` };
    });

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
            <Bar data={data} options={options} />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-md shadow-sm border-l-4 ${insight.type === "over"
                                ? "border-red-500 bg-red-50"
                                : insight.type === "under"
                                    ? "border-green-500 bg-green-50"
                                    : "border-blue-500 bg-blue-50"
                            }`}
                    >
                        <p className="text-sm text-gray-800">{insight.msg}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}