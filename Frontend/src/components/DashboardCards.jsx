import React from "react";

export default function DashboardCards({ transactions }) {

    let totalIncome = 0;
    let totalExpense = 0;
    let latestTransaction = transactions[0];
    const categoryTotals = {};

    transactions.forEach(txn => {
        if (txn.type === "income") {
            totalIncome += txn.amount;
        }
        if (txn.type === "expense") {
            totalExpense += txn.amount;
            const category = txn.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
        }
    })

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])

    const mostSpentCat = sortedCategories.length > 0 ? sortedCategories[0][0] : "N/A";
    const totalBalance = totalIncome - totalExpense;


    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-center mb-4">Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-lg font-bold text-green-600">₹{totalIncome}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Expense</p>
                    <p className="text-lg font-bold text-red-600">₹{totalExpense}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-lg font-bold text-gray-700">₹{totalBalance}</p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Most Spent Category: <span className="font-semibold text-red-500">{mostSpentCat}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    Latest Transaction:{" "}
                    <span className="font-medium">
                        {latestTransaction?.name || "N/A"} (₹{latestTransaction?.amount || 0})
                    </span>
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {sortedCategories.map(([cat, amt]) => (
                    <div key={cat} className="p-4 bg-gray-100 rounded shadow">
                        <h4 className="font-semibold capitalize">{cat}</h4>
                        <p className="text-gray-700">₹ {amt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}