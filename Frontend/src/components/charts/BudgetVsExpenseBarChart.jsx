import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BudgetVsExpenseBarChart({ budgets, transactions }) {

    const expenseTotals = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach(txn => {
        if (txn.type === 'expense') {
            const month = new Date(txn.date).toLocaleString('default', { month: 'short' })
            expenseTotals[month] = (expenseTotals[month] || 0) + txn.amount;
        }
    });

    const budgetTotals = {};
    budgets.forEach(budget => {
        const { month, categories } = budget;
        const total = Object.values(categories).reduce((sum, val) => sum + Number(val || 0), 0);
        budgetTotals[month] = total;
    });

    const months = [...new Set([...Object.keys(expenseTotals), ...Object.keys(budgetTotals)])]
        .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    const data = {
        labels: months,
        datasets: [
            {
                label: "Budget (₹)",
                data: months.map(m => budgetTotals[m] || 0),
                backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderRadius: 6
            },
            {
                label: "Expenses (₹)",
                data: months.map(m => expenseTotals[m] || 0),
                backgroundColor: "rgba(255, 99, 132, 0.6)", // Red
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                borderRadius: 6
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: {
                display: true,
                text: "Budget vs Expenses (Monthly)",
                font: { size: 18 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Amount (₹)",
                    font: { size: 14 }
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Month",
                    font: { size: 14 }
                }
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
            {months.length === 0 ? (
                <p className="text-center text-gray-500">No data available to display.</p>
            ) : (
                <div className="h-full">
                    <Bar data={data} options={options} />
                </div>
            )}
        </div>
    );
}