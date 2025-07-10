import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend); // All these will be required in Bar internally

export default function MonthlyExpensesChart({ transactions }) {

    const monthlyTotals = {};

    transactions.forEach(txn => {
        if (txn.type === 'expense') {
            const month = new Date(txn.date).toLocaleString('default', { month: 'short' }); // Extracting short month name like Jan Feb
            monthlyTotals[month] = (monthlyTotals[month] || 0) + txn.amount; // its like monthlyTotals[july] = 0 + 500 || monthlyTotals[jan] = 500 + 60
        }
    });

    const labels = Object.keys(monthlyTotals); // All labels for x axis basically month names
    const data = {
        labels,
        datasets: [
            {
                label: 'Expenses (₹)',
                data: Object.values(monthlyTotals), // All values for y axis basically expense amounts
                backgroundColor: ['rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                ],
                borderRadius: 8,
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            },
        ],
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">Monthly Expenses</h3>
            <Bar data={data} />
        </div>
    );
}