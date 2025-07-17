import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend); // All these will be required in Bar internally

export default function MonthlyExpensesChart({ transactions }) {

    const monthlyTotals = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach(txn => {
        if (txn.type === 'expense') {
            const month = new Date(txn.date).toLocaleString('default', { month: 'short' }); // Extracting short month name like Jan Feb
            monthlyTotals[month] = (monthlyTotals[month] || 0) + txn.amount; // its like monthlyTotals[july] = 0 + 500 || monthlyTotals[jan] = 500 + 60
        }
    });

    const labels = Object.keys(monthlyTotals).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // All labels for x axis basically month names
    const data = {
        labels,
        datasets: [
            {
                label: 'Expenses (₹)',
                data: Object.values(monthlyTotals), // All values for y axis basically expense amounts
                backgroundColor: ['rgba(255, 99, 132, 0.2)',
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
                ],
                borderRadius: 8,
                borderColor: [
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