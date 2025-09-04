import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MonthlyExpensesChart({ transactions }) {

    const monthlyTotals = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach(txn => {
        if (txn.type === 'expense') {
            // Manual parsing of YYYY-MM-DD to avoid timezone issues
            const [year, month, day] = txn.date.split('-').map(Number);
            const monthName = monthNames[month - 1]; // month-1 because array is 0-indexed
            monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + txn.amount;
        }
    });

    const labels = monthOrder.filter(month => monthlyTotals[month] !== undefined);

    const data = {
        labels,
        datasets: [
            {
                label: 'Expenses (₹)',
                data: labels.map(label => monthlyTotals[label]),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.75)',
                    'rgba(54, 162, 235, 0.75)',
                    'rgba(255, 206, 86, 0.75)',
                    'rgba(75, 192, 192, 0.75)',
                    'rgba(153, 102, 255, 0.75)',
                    'rgba(255, 159, 64, 0.75)',
                    'rgba(199, 199, 199, 0.75)',
                    'rgba(100, 255, 218, 0.75)',
                    'rgba(255, 102, 255, 0.75)',
                    'rgba(160, 160, 255, 0.75)',
                    'rgba(0, 200, 83, 0.75)',
                    'rgba(255, 112, 67, 0.75)'
                ],
                borderRadius: 8,
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(100, 255, 218, 1)',
                    'rgba(255, 102, 255, 1)',
                    'rgba(160, 160, 255, 1)',
                    'rgba(0, 200, 83, 1)',
                    'rgba(255, 112, 67, 1)'
                ],
                borderWidth: 1
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: "bottom"
            },
        }
    }

    return (
        <div className="w-full px-4 sm:px-0 mt-5">
            <div className="max-w-md sm:max-w-2xl mx-auto p-4 rounded-xl shadow-lg">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
