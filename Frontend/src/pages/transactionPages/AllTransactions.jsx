import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { TbScale } from "react-icons/tb";

export default function AllTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/allTransactions`);
                const reversed = res.data.reverse();
                setTransactions(reversed);
                applyFilters(reversed);
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError("Failed to load transactions.");
            }
        };

        fetchTransactions();
    }, []);

    const applyFilters = (source = transactions) => {
        let result = source;

        if (categoryFilter) {
            result = result.filter(txn => txn.category === categoryFilter);
        }
        if (yearFilter) {
            result = result.filter(txn => new Date(txn.date).getFullYear().toString() === yearFilter);
        }
        if (monthFilter) {
            result = result.filter(txn => (new Date(txn.date).getMonth() + 1).toString().padStart(2, '0') === monthFilter);
        }
        if (dateFilter) {
            result = result.filter(txn => new Date(txn.date).getDate().toString() === dateFilter);
        }

        setFiltered(result);
    };

    useEffect(() => {
        applyFilters();
    }, [categoryFilter, monthFilter, yearFilter, dateFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await axios.delete(`${BASE_URL}/deleteTransaction/${id}`);
            const updated = transactions.filter(txn => txn._id !== id);
            setTransactions(updated);
            applyFilters(updated);
            setMessage("Transaction deleted successfully!");
            setError("");
        } catch (err) {
            console.error("Error deleting transaction:", err);
            setError("Failed to delete transaction.");
            setMessage("");
        }
    };

    const allCategories = [...new Set(transactions.map(t => t.category))]; // To take out all unique categories as an array for dropdown 

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};
    let latestTransaction = filtered[0];

    filtered.forEach(txn => {
        if (txn.type === "income") totalIncome += txn.amount;
        if (txn.type === "expense") {
            totalExpense += txn.amount;
            categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const mostSpentCat = sortedCategories.length > 0 ? sortedCategories[0][0] : "N/A";
    const totalBalance = totalIncome - totalExpense;

    return (
        <div className="max-w-8xl mx-auto mt-12 px-12 space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-14 gap-6 sm:gap-10 px-4 sm:px-0">

                <div className="text-center sm:text-left">
                    <h1 className="text-4xl sm:text-6xl text-txt drop-shadow-sm">
                        Personal Finance Ledger
                    </h1>
                    <p className="mt-3 max-w-xl text-base text-sectxt leading-7">
                        Track where your money flows, effortlessly. Manage income, expenses, and trends in one place.
                    </p>
                </div>

                <div className="text-center sm:text-right">
                    <Link
                        to="/addtransaction"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-secondary text-secondary font-semibold rounded-full hover:bg-secondary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Transaction
                    </Link>
                </div>

            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column */}
                <div className="lg:col-span-3 space-y-6">

                    <div className="text-3xl text-secondary px-2">
                        Financial Dashboard
                    </div>

                    <div className="grid grid-cols-1 gap-4 pr-5">

                        <div className="py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-yellow-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 leading-10">Balance</h3>
                                    <p className="text-lg font-bold text-gray-800 mb-1">₹{totalBalance}</p>
                                </div>
                                <TbScale className="text-3xl text-yellow-600 min-w-fit" />
                            </div>
                        </div>

                        <div className="py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-green-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 leading-10">Total Income</h3>
                                    <p className="text-lg font-bold text-green-700 mb-1">₹{totalIncome}</p>
                                </div>
                                <FiTrendingUp className="text-3xl text-green-600 min-w-fit" />
                            </div>
                        </div>

                        <div className="py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-red-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 leading-10">Total Expense</h3>
                                    <p className="text-lg font-bold text-red-700 mb-1">₹{totalExpense}</p>
                                </div>
                                <FiTrendingDown className="text-3xl text-red-600 min-w-fit" />
                            </div>
                        </div>

                    </div>

                    <div className="rounded-xl  py-4 px-8 mr-5 shadow-md hover:shadow-xl transition duration-500 border-1 border-dashed border-secondary">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Category-wise Expense</h3>
                        <div className="space-y-3">
                            {sortedCategories.map(([cat, amt], index) => {
                                const colors = [
                                    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
                                    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
                                ];
                                const color = colors[index % colors.length];
                                return (
                                    <div key={cat} className="flex justify-between items-center text-gray-600 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${color}`}></span>
                                            <span className="capitalize font-medium">{cat}</span>
                                        </div>
                                        <span className="font-semibold text-gray-700">₹ {amt}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Center Column */}
                <div className="lg:col-span-6 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h4 className="font-semibold text-gray-700 mb-2">Most Spent Category</h4>
                            <p className="text-gray-600 capitalize">{mostSpentCat} (₹{categoryTotals[mostSpentCat] || 0})</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h4 className="font-semibold text-gray-700 mb-2">Latest Transaction</h4>
                            <p className="text-gray-600">{latestTransaction?.name || "N/A"} (₹{latestTransaction?.amount || 0})</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 text-center">All Transactions</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                        {filtered.length === 0 ? (
                            <p className="text-center text-gray-500">No transactions to show.</p>
                        ) : (
                            filtered.map((txn) => (
                                <div
                                    key={txn._id}
                                    className={`relative rounded-xl border-l-4 shadow-md p-4 bg-white border ${txn.type === "income" ? "border-green-500" : "border-red-500"} group`}
                                >
                                    <div className="absolute top-3 right-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/updatetransaction/${txn._id}`} className="text-gray-400 hover:text-blue-600" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(txn._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-lg font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                            ₹ {txn.amount}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(txn.date).toLocaleString("en-IN", {
                                                year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
                                            })}
                                        </span>
                                    </div>
                                    <div className="text-gray-700 mb-1 font-medium">{txn.name}</div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="capitalize">Type: {txn.type}</span>
                                        <span>Category: {txn.category}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-gradient-to-r from-white via-blue-50 to-white p-6 rounded-xl shadow-md border border-blue-100 space-y-4">
                        <div className="flex flex-col w-40">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Date</label>
                            <DatePicker
                                selected={
                                    dateFilter
                                        ? new Date(
                                            yearFilter || new Date().getFullYear(),
                                            monthFilter ? parseInt(monthFilter) - 1 : new Date().getMonth(),
                                            parseInt(dateFilter)
                                        )
                                        : null
                                }
                                onChange={(date) => {
                                    setDateFilter(String(date.getDate()));
                                    setMonthFilter(String(date.getMonth() + 1).padStart(2, '0'));
                                    setYearFilter(String(date.getFullYear()));
                                }}
                                dateFormat="dd"
                                minDate={
                                    new Date(
                                        yearFilter || new Date().getFullYear(),
                                        monthFilter ? parseInt(monthFilter) - 1 : 0,
                                        1
                                    )
                                }
                                maxDate={
                                    new Date(
                                        yearFilter || new Date().getFullYear(),
                                        monthFilter ? parseInt(monthFilter) : new Date().getMonth() + 1,
                                        0
                                    )
                                }
                                className="border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition w-full bg-white"
                            />
                        </div>
                        <div className="flex flex-col w-40">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Month</label>
                            <DatePicker
                                selected={monthFilter ? new Date(new Date().getFullYear(), parseInt(monthFilter) - 1, 1) : null}
                                onChange={(date) => {
                                    setMonthFilter(String(date.getMonth() + 1).padStart(2, '0'));
                                    setDateFilter("");
                                }}
                                dateFormat="MMM"
                                showMonthYearPicker
                                renderCustomHeader={({ date, changeMonth }) => (
                                    <div className="text-center font-semibold text-blue-700 mb-2">
                                        {date.toLocaleString('default', { month: 'short' })}
                                    </div>
                                )}
                                className="border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition w-full bg-white"
                            />
                        </div>
                        <div className="flex flex-col w-40">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Year</label>
                            <DatePicker
                                selected={yearFilter ? new Date(`${yearFilter}-01-01`) : null}
                                onChange={(date) => {
                                    setYearFilter(String(date.getFullYear()));
                                    setMonthFilter("");
                                    setDateFilter("");
                                }}
                                showYearPicker
                                dateFormat="yyyy"
                                className="border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition w-full bg-white"
                                renderCustomHeader={({ date }) => (
                                    <div className="text-center text-blue-700 font-semibold text-lg">
                                        {date.getFullYear()}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="flex flex-col w-48">
                            <label className="text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
                            >
                                <option value="">All Categories</option>
                                {allCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                setMonthFilter("");
                                setDateFilter("");
                                setYearFilter("");
                                setCategoryFilter("");
                            }}
                            className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg mt-6 hover:bg-red-600 transition shadow"
                        >
                            Clear Filters
                        </button>
                        {(dateFilter || monthFilter || yearFilter || categoryFilter) && (
                            <div className="flex flex-wrap gap-2 text-sm text-gray-700 mt-2 ml-2">
                                <span className="font-semibold">Active Filters:</span>
                                {dateFilter && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Date: {dateFilter}</span>
                                )}
                                {monthFilter && (
                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Month: {new Date(0, parseInt(monthFilter) - 1).toLocaleString('default', { month: 'short' })}</span>
                                )}
                                {yearFilter && (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Year: {yearFilter}</span>
                                )}
                                {categoryFilter && (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Category: {categoryFilter}</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <Link to="/transactionanalytics" className="inline-block px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                            Go to Analytics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`text-center mt-4 font-medium ${message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </div>
            )}
        </div>

    );
}
