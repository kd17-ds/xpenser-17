import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaSearchDollar } from 'react-icons/fa';

const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function AllBudgets() {
    const [budgets, setBudgets] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState({});
    const [yearlyExpenses, setYearlyExpenses] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [viewMode, setViewMode] = useState("monthly");
    const [monthFilter, setMonthFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const isYearOnly = viewMode === "yearly";

    const fetchBudget = async () => {
        try {
            const query = new URLSearchParams();
            if (monthFilter) query.append("month", monthFilter);
            if (yearFilter) query.append("year", yearFilter);

            const res = await axios.get(`${BASE_URL}/showbudget?${query.toString()}`);
            setBudgets(res.data.reverse());
            setError("");
        } catch (err) {
            console.error("Error fetching Budget:", err);
            setError("Failed to load Budgets.");
        }
    };

    const fetchExpenses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/allTransactions`);
            const expensesOnly = res.data.filter(txn => txn.type === "expense");

            const monthly = {};
            const yearly = {};

            expensesOnly.forEach(txn => {
                const date = new Date(txn.date);
                const monthKey = `${months[date.getMonth() + 1]} ${date.getFullYear()}`;
                const yearKey = `${date.getFullYear()}`;

                if (!monthly[monthKey]) monthly[monthKey] = {};
                if (!yearly[yearKey]) yearly[yearKey] = {};

                if (!monthly[monthKey][txn.category]) monthly[monthKey][txn.category] = 0;
                if (!yearly[yearKey][txn.category]) yearly[yearKey][txn.category] = 0;

                monthly[monthKey][txn.category] += txn.amount;
                yearly[yearKey][txn.category] += txn.amount;
            });

            setMonthlyExpenses(monthly);
            setYearlyExpenses(yearly);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    };

    useEffect(() => {
        fetchBudget();
        fetchExpenses();
    }, [monthFilter, yearFilter]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this Budget?");
        if (!confirm) return;
        try {
            const res = await axios.delete(`${BASE_URL}/deletebudget/${id}`);
            setBudgets((prev) => prev.filter(bgt => bgt._id !== id));
            setMessage(res.data?.message);
            setError("");
        } catch (err) {
            console.error("Error deleting Budget:", err);
            setError("Failed to delete Budget.");
            setMessage("");
        }
    };

    const yearlyGroupedBudgets = budgets.reduce((acc, bgt) => {
        if (!acc[bgt.year]) acc[bgt.year] = {};

        for (const [cat, amt] of Object.entries(bgt.categories)) {
            if (!acc[bgt.year][cat]) acc[bgt.year][cat] = 0;
            acc[bgt.year][cat] += amt;
        }
        return acc;
    }, {});

    return (
        <div className="max-w-8xl mx-auto mt-12 px-5 md:px-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-14 gap-6 lg:gap-10 sm:px-0">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-6xl text-txt drop-shadow-sm">
                        Budget Beacon
                    </h1>
                    <p className="mt-6 mx-auto lg:mx-0 max-w-xl text-base text-sectxt leading-7">
                        Get a clear overview of your monthly budget allocations and spending.
                        Compare side-by-side with actual expenses.
                    </p>
                </div>
                <div className="text-center sm:text-right">
                    <Link
                        to="/setbudget"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-secondary text-secondary font-semibold rounded-full hover:bg-secondary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Set New Budget
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
                {/* Link Button */}
                <div className="text-center md:text-left">
                    <Link
                        to="/budgetvsexpensecomparison"
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 border-2 border-txt text-txt font-semibold rounded-2xl hover:bg-txt hover:text-white transition whitespace-nowrap"
                    >
                        <FaSearchDollar className="text-xl" />
                        <span>Budget & Expense Summary</span>
                    </Link>
                </div>

                {/* Filter Box */}
                <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 bg-purple-50 border border-purple-200 px-4 sm:px-6 py-4 rounded-xl shadow-sm ">
                    {/* View Mode */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-purple-700 whitespace-nowrap">View:</label>
                        <select
                            value={viewMode}
                            onChange={(e) => {
                                setViewMode(e.target.value);
                                if (e.target.value === "yearly") setMonthFilter("");
                            }}
                            className="px-3 py-2 border border-purple-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* Month Filter */}
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        disabled={isYearOnly}
                        className="px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-sm min-w-[120px]"
                    >
                        {months.map((m, i) => (
                            <option key={i} value={m}>
                                {m || "All Months"}
                            </option>
                        ))}
                    </select>

                    {/* Year Filter */}
                    <input
                        type="number"
                        placeholder="Year"
                        value={yearFilter}
                        min="2020"
                        max="2100"
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-sm w-[100px]"
                    />

                    {/* Clear Button */}
                    <button
                        onClick={() => {
                            setMonthFilter("");
                            setYearFilter("");
                            setViewMode("monthly");
                        }}
                        className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition shadow whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>

            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {(budgets.length === 0 && !isYearOnly) ? (
                <p className="text-center text-gray-500">No budget entries found.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Budgets Column */}
                    <div className="space-y-6">
                        {isYearOnly
                            ? Object.entries(yearlyGroupedBudgets).map(([year, cats]) => (
                                <div
                                    key={year}
                                    className="p-5 rounded-xl shadow-md border-l-4 border-purple-500 bg-purple-50 hover:scale-[1.01] transition-transform"
                                >
                                    <div className="mb-5">
                                        <h3 className="text-xl font-semibold text-purple-700 flex justify-between items-center">
                                            <span>Year {year} ( Budget )</span>
                                            <span className="hidden sm:inline text-lg text-purple-600 font-semibold">
                                                ₹ {Object.values(cats).reduce((acc, val) => acc + val, 0)}
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                        {Object.entries(cats).map(([cat, amt]) => (
                                            <div key={cat} className="flex justify-between border-b py-1">
                                                <span className="font-medium break-words max-w-[60%]">{cat}</span>
                                                <span>₹ {amt || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Responsive Total for Budget */}
                                    <div className="sm:hidden mt-5 text-right text-lg text-purple-600">
                                        Total Budget: ₹ {Object.values(cats).reduce((acc, val) => acc + val, 0)}
                                    </div>
                                </div>
                            ))
                            : budgets.map((bgt) => (
                                <div
                                    key={bgt._id}
                                    className="group p-5 rounded-xl shadow-md border-l-4 border-purple-500 bg-purple-50 hover:scale-[1.01] transition-transform"
                                >
                                    <div className="flex justify-between items-center mb-5">
                                        <h3 className="text-xl font-semibold text-purple-700">
                                            <span>
                                                {bgt.month} {bgt.year} ( Budget )
                                            </span>
                                        </h3>

                                        <div className="relative w-fit">
                                            <span className="hidden sm:inline text-lg font-semibold text-purple-600 z-10 relative">
                                                ₹ {Object.values(bgt.categories).reduce((acc, val) => acc + val, 0)}
                                            </span>

                                            <div className="absolute inset-0 flex items-center justify-end gap-3 
                                        sm:opacity-0 sm:group-hover:opacity-100 
                                        opacity-100 transition-opacity duration-300 bg-purple-50 z-20">
                                                <Link
                                                    to={`/updatebudget/${bgt._id}`}
                                                    className="text-gray-500 hover:text-purple-600"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(bgt._id)}
                                                    className="text-gray-500 hover:text-red-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                        {Object.entries(bgt.categories).map(([cat, amt]) => (
                                            <div key={cat} className="flex justify-between border-b py-1">
                                                <span className="font-medium break-words max-w-[60%]">{cat}</span>
                                                <span>₹ {amt || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Responsive Total for Budget */}
                                    <div className="sm:hidden mt-5 text-right text-lg text-purple-600">
                                        Total Budget: ₹ {Object.values(bgt.categories).reduce((acc, val) => acc + val, 0)}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Expenses Column */}
                    <div className="space-y-6">
                        {isYearOnly
                            ? Object.entries(yearlyGroupedBudgets).map(([year, cats]) => {
                                const expenses = yearlyExpenses[year] || {};
                                return (
                                    <div
                                        key={`expense-${year}`}
                                        className="p-5 rounded-xl shadow-md border-l-4 border-red-400 bg-red-50 hover:scale-[1.01] transition-transform"
                                    >
                                        <div className="mb-5">
                                            <h3 className="text-xl font-semibold text-red-700 flex justify-between items-center">
                                                <span>Year {year} ( Expenses )</span>
                                                <span className="hidden sm:inline text-lg text-red-600 font-semibold">
                                                    ₹{" "}
                                                    {Object.keys(cats).reduce(
                                                        (sum, cat) => sum + (expenses[cat] || 0),
                                                        0
                                                    )}
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                            {Object.keys(cats).map((cat) => (
                                                <div
                                                    key={cat}
                                                    className="flex justify-between border-b py-1"
                                                >
                                                    <span className="font-medium break-words max-w-[60%]">{cat}</span>
                                                    <span>₹ {expenses[cat] || 0}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Responsive Total for Expenses */}
                                        <div className="sm:hidden mt-5 text-right text-lg  text-red-600">
                                            Total Expenses: ₹ {Object.keys(cats).reduce(
                                                (sum, cat) => sum + (expenses[cat] || 0),
                                                0
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                            : budgets.map((bgt) => {
                                const key = `${bgt.month} ${bgt.year}`;
                                const expenses = monthlyExpenses[key] || {};
                                return (
                                    <div
                                        key={`expense-${bgt._id}`}
                                        className="p-5 rounded-xl shadow-md border-l-4 border-red-400 bg-red-50 hover:scale-[1.01] transition-transform"
                                    >
                                        <div className="mb-5">
                                            <h3 className="text-xl font-semibold text-red-700 flex justify-between items-center">
                                                <span>{key} ( Expenses )</span>
                                                <span className="hidden sm:inline text-lg text-red-600 font-semibold">
                                                    ₹{" "}
                                                    {Object.keys(bgt.categories).reduce(
                                                        (sum, cat) => sum + (expenses[cat] || 0),
                                                        0
                                                    )}
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                            {Object.keys(bgt.categories).map((cat) => (
                                                <div
                                                    key={cat}
                                                    className="flex justify-between border-b py-1"
                                                >
                                                    <span className="font-medium break-words max-w-[60%]">{cat}</span>
                                                    <span>₹ {expenses[cat] || 0}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Responsive Total for Expenses */}
                                        <div className="sm:hidden mt-5 text-right text-lg  text-red-600">
                                            Total Expenses: ₹ {Object.keys(bgt.categories).reduce(
                                                (sum, cat) => sum + (expenses[cat] || 0),
                                                0
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {message && (
                <div className="text-center mt-4 font-medium text-green-600">{message}</div>
            )}
        </div>
    );
}
