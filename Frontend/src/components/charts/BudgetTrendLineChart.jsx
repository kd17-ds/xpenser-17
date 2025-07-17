import React from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getMonthYearIndex(month, year) {
    return parseInt(year) * 12 + months.indexOf(month); // For ex Jan, 2025 → 2025 * 12 + 0 = 24300
}

export default function BudgetTrendLineChart({ budgets, transactions, fromMonth, fromYear, toMonth, toYear }) {
    if (!fromMonth || !fromYear || !toMonth || !toYear) {
        return <p className="text-center text-gray-500">Please select a valid month/year range.</p>;
    }

    const fromIndex = getMonthYearIndex(fromMonth, fromYear);
    const toIndex = getMonthYearIndex(toMonth, toYear);

    const monthlyData = {};

    // Initialize months between range
    for (let y = parseInt(fromYear); y <= parseInt(toYear); y++) {
        for (let m = 0; m < 12; m++) {
            const index = y * 12 + m;
            if (index < fromIndex) continue;
            if (index > toIndex) break;
            const key = `${months[m]} ${y}`;
            monthlyData[key] = { budget: 0, expense: 0 };
        }
    }

    // Populate budget data
    budgets.forEach(b => {
        const key = `${b.month} ${b.year}`;
        if (monthlyData[key]) {
            const total = Object.values(b.categories || {}).reduce((acc, val) => acc + Number(val), 0);
            monthlyData[key].budget += total;
        }
    });

    // Populate transaction data
    transactions.forEach(txn => {
        if (txn.type !== "expense") return;
        const date = new Date(txn.date);
        const m = date.toLocaleString("default", { month: "short" });
        const y = date.getFullYear();
        const key = `${m} ${y}`;
        if (monthlyData[key]) {
            monthlyData[key].expense += txn.amount;
        }
    });

    const labels = Object.keys(monthlyData);
    const budgetValues = labels.map(key => monthlyData[key].budget);
    const expenseValues = labels.map(key => monthlyData[key].expense);

    const data = {
        labels,
        datasets: [
            {
                label: "Budget (₹)",
                data: budgetValues,
                fill: false,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                tension: 0.4,
            },
            {
                label: "Expenses (₹)",
                data: expenseValues,
                fill: false,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: `Budget vs Expense Trend (${fromMonth} ${fromYear} - ${toMonth} ${toYear})`,
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

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
            <Line data={data} options={options} />
        </div>
    );
}