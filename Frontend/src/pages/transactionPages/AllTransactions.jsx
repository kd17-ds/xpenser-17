import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import {
    FaEdit,
    FaTrash,
    FaChartPie,
    FaClock,
    FaMoneyBillWave,
    FaTag,
    FaWallet,
    FaUtensils,
    FaHome,
    FaBus,
    FaBolt,
    FaFilm,
    FaTshirt,
    FaHeartbeat,
    FaBook,
    FaQuestionCircle,
} from "react-icons/fa";
import { MdLocalGroceryStore } from "react-icons/md";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { TbScale } from "react-icons/tb";

export default function AllTransactions() {
    const categoryIcons = {
        food: FaUtensils,
        rent: FaHome,
        travel: FaBus,
        utilities: FaBolt,
        entertainment: FaFilm,
        grocery: MdLocalGroceryStore,
        shopping: FaTshirt,
        healthcare: FaHeartbeat,
        education: FaBook,
        other: FaQuestionCircle,
    };
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
            result = result.filter((txn) => txn.category === categoryFilter);
        }
        if (yearFilter) {
            result = result.filter(
                (txn) => new Date(txn.date).getFullYear().toString() === yearFilter
            );
        }
        if (monthFilter) {
            result = result.filter(
                (txn) =>
                    (new Date(txn.date).getMonth() + 1).toString().padStart(2, "0") ===
                    monthFilter
            );
        }
        if (dateFilter) {
            result = result.filter(
                (txn) => new Date(txn.date).getDate().toString() === dateFilter
            );
        }

        setFiltered(result);
    };

    useEffect(() => {
        applyFilters();
    }, [categoryFilter, monthFilter, yearFilter, dateFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?"))
            return;
        try {
            await axios.delete(`${BASE_URL}/deleteTransaction/${id}`);
            const updated = transactions.filter((txn) => txn._id !== id);
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

    const allCategories = [...new Set(transactions.map((t) => t.category))]; // To take out all unique categories as an array for dropdown

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};
    let latestTransaction = filtered[0];

    filtered.forEach((txn) => {
        if (txn.type === "income") totalIncome += txn.amount;
        if (txn.type === "expense") {
            totalExpense += txn.amount;
            categoryTotals[txn.category] =
                (categoryTotals[txn.category] || 0) + txn.amount;
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
    );
    const mostSpentCat =
        sortedCategories.length > 0 ? sortedCategories[0][0] : "N/A";
    const totalBalance = totalIncome - totalExpense;

    return (
        <div className="max-w-8xl mx-auto mt-12 md:px-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-14 gap-6 lg:gap-10 px-4 sm:px-0">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-6xl text-txt drop-shadow-sm">
                        Personal Finance Ledger
                    </h1>
                    <p className="mt-6 lg:mt-3 mx-auto lg:mx-0 max-w-xl text-base text-sectxt leading-7">
                        Track where your money flows, effortlessly. Manage income, expenses,
                        and trends in one place.
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add New Transaction
                    </Link>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-3 space-y-6 px-6 lg:px-0">
                    <div className="text-3xl text-secondary px-2">
                        Financial Dashboard
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-yellow-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 leading-10">
                                        Balance
                                    </h3>
                                    <p className="text-lg font-bold text-gray-800 mb-1">
                                        ₹ {totalBalance}
                                    </p>
                                </div>
                                <TbScale className="text-3xl text-yellow-600 min-w-fit" />
                            </div>
                        </div>

                        <div className="py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-green-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 leading-10">
                                        Total Income
                                    </h3>
                                    <p className="text-lg font-bold text-green-700 mb-1">
                                        ₹ {totalIncome}
                                    </p>
                                </div>
                                <FiTrendingUp className="text-3xl text-green-600 min-w-fit" />
                            </div>
                        </div>

                        <div className="py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-red-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 leading-10">
                                        Total Expense
                                    </h3>
                                    <p className="text-lg font-bold text-red-700 mb-1">
                                        ₹ {totalExpense}
                                    </p>
                                </div>
                                <FiTrendingDown className="text-3xl text-red-600 min-w-fit" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl  py-4 px-8 shadow-md hover:shadow-xl transition duration-500 border-1 border-dashed border-secondary">
                        <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
                            Categorical Ledger
                        </h3>
                        <div className="space-y-3">
                            {sortedCategories.map(([cat, amt], index) => {
                                const colors = [
                                    "bg-red-500",
                                    "bg-blue-500",
                                    "bg-green-500",
                                    "bg-yellow-500",
                                    "bg-purple-500",
                                    "bg-pink-500",
                                    "bg-indigo-500",
                                    "bg-teal-500",
                                ];
                                const color = colors[index % colors.length];
                                return (
                                    <div
                                        key={cat}
                                        className="flex justify-between items-center text-gray-600 text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${color}`}></span>
                                            <span className="capitalize font-medium">{cat}</span>
                                        </div>
                                        <span className="font-semibold text-gray-500">₹ {amt}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Highlight Cards */}
                    <div className="mb-10">
                        {/* Most Spent Category */}
                        <div className="p-6 mb-6 shadow-md hover:shadow-xl transition duration-500 rounded-2xl  bg-orange-50">
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h4 className="text-lg font-semibold text-orange-700 mb-1">
                                        Most Spent Category
                                    </h4>
                                    <p className="text-base text-orange-800 capitalize">
                                        {mostSpentCat} : &nbsp;₹{categoryTotals[mostSpentCat] || 0}
                                    </p>
                                </div>
                                <span className="text-3xl text-orange-500">
                                    <FaChartPie />
                                </span>
                            </div>
                        </div>

                        {/* Latest Transaction */}
                        <div className="p-6 mb-6 shadow-md hover:shadow-xl transition duration-500 rounded-2xl bg-blue-50">
                            <div className="flex items-center  justify-between ">
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-700 mb-1">
                                        Latest Transaction
                                    </h4>
                                    <p className="text-base text-blue-800">
                                        {latestTransaction?.name || "N/A"} : &nbsp;₹
                                        {latestTransaction?.amount || 0}
                                    </p>
                                </div>
                                <span className="text-3xl text-blue-500">
                                    <FaClock />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/transactionanalytics"
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-txt text-txt font-semibold rounded-2xl hover:bg-txt hover:text-white transition"
                        >
                            <FaChartPie className="text-xl align-middle" />
                            <span className="leading-none">Detailed Overview</span>
                        </Link>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-9 space-y-6 px-6 lg:px-15">
                    {/* Main Section Heading */}
                    <div className="text-3xl text-txt px-2 text-center mb-7">
                        Transaction Ledger
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="bg-gradient-to-br from-purple-100 via-white to-purple-50 p-6 rounded-2xl border border-secondary/30 shadow-md space-y-6 w-full mx-auto">
                        {/* Filters Section */}
                        <div className="flex flex-wrap justify-between gap-4">
                            {/* Date Filter */}
                            <div className="flex flex-col min-w-[130px] flex-1">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Date
                                </label>
                                <DatePicker
                                    selected={
                                        dateFilter
                                            ? new Date(
                                                yearFilter || new Date().getFullYear(),
                                                monthFilter
                                                    ? parseInt(monthFilter) - 1
                                                    : new Date().getMonth(),
                                                parseInt(dateFilter)
                                            )
                                            : null
                                    }
                                    onChange={(date) => {
                                        setDateFilter(String(date.getDate()));
                                        setMonthFilter(
                                            String(date.getMonth() + 1).padStart(2, "0")
                                        );
                                        setYearFilter(String(date.getFullYear()));
                                    }}
                                    dateFormat="dd"
                                    className="border border-purple-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-full bg-white"
                                />
                            </div>

                            {/* Month Filter */}
                            <div className="flex flex-col min-w-[130px] flex-1">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Month
                                </label>
                                <DatePicker
                                    selected={
                                        monthFilter
                                            ? new Date(
                                                new Date().getFullYear(),
                                                parseInt(monthFilter) - 1,
                                                1
                                            )
                                            : null
                                    }
                                    onChange={(date) => {
                                        setMonthFilter(
                                            String(date.getMonth() + 1).padStart(2, "0")
                                        );
                                        setDateFilter("");
                                    }}
                                    dateFormat="MMM"
                                    showMonthYearPicker
                                    className="border border-purple-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-full bg-white"
                                />
                            </div>

                            {/* Year Filter */}
                            <div className="flex flex-col min-w-[130px] flex-1">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Year
                                </label>
                                <DatePicker
                                    selected={yearFilter ? new Date(`${yearFilter}-01-01`) : null}
                                    onChange={(date) => {
                                        setYearFilter(String(date.getFullYear()));
                                        setMonthFilter("");
                                        setDateFilter("");
                                    }}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    className="border border-purple-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-full bg-white"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-col min-w-[150px] flex-1">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full appearance-none border border-purple-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition hover:cursor-pointer"
                                    >
                                        <option value="">All Categories</option>
                                        {allCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Dropdown Arrow */}
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-purple-500">
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters + Clear Button */}
                        {(dateFilter || monthFilter || yearFilter || categoryFilter) && (
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
                                    <span className="font-semibold">Active Filters:</span>
                                    {dateFilter && (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            Date: {dateFilter}
                                        </span>
                                    )}
                                    {monthFilter && (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                            Month:{" "}
                                            {new Date(0, parseInt(monthFilter) - 1).toLocaleString(
                                                "default",
                                                {
                                                    month: "short",
                                                }
                                            )}
                                        </span>
                                    )}
                                    {yearFilter && (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                            Year: {yearFilter}
                                        </span>
                                    )}
                                    {categoryFilter && (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            Category: {categoryFilter}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setMonthFilter("");
                                        setDateFilter("");
                                        setYearFilter("");
                                        setCategoryFilter("");
                                    }}
                                    className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 hover:cursor-pointer transition shadow"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Transactions List */}
                    <div
                        className="mt-6 sm:px-4 py-4 max-h-[100vh] overflow-y-auto  space-y-4 scroll-smooth pb-6 pt-4 sm:scrollbar-thin sm:scrollbar-thumb-gray-400 sm:scrollbar-track-transparent"
                        style={{
                            scrollbarWidth: window.innerWidth < 640 ? "none" : undefined,
                            msOverflowStyle: window.innerWidth < 640 ? "none" : undefined,
                        }}
                    >
                        <style>
                            {`
                                    @media (max-width: 639px) {
                                        div::-webkit-scrollbar {
                                            display: none;
                                                        }
                                                        }
                                                        `}
                        </style>
                        {filtered.length === 0 ? (
                            <p className="text-center text-gray-500">
                                No transactions to show.
                            </p>
                        ) : (
                            filtered.map((txn) => (
                                <div
                                    key={txn._id}
                                    className={`relative group w-full flex flex-col sm:grid sm:grid-cols-2 sm:gap-4 p-5 rounded-2xl shadow-md border-l-4 transition-transform duration-300 hover:scale-[1.01] ${txn.type === "income"
                                        ? "bg-green-50 border-green-500"
                                        : "bg-red-50 border-red-500"
                                        }`}
                                >
                                    {/* Top: Left Section */}
                                    <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                                        {/* Category Icon */}
                                        <div className="p-2 rounded-full border-r-2 border-gray-300">
                                            {(() => {
                                                const Icon =
                                                    categoryIcons[txn.category?.toLowerCase()] ||
                                                    FaRegCircle;
                                                return (
                                                    <Icon className="text-2xl sm:text-3xl text-gray-600" />
                                                );
                                            })()}
                                        </div>

                                        {/* Amount + Name */}
                                        <div className="flex flex-col gap-3 sm:gap-2">
                                            <div className="flex-col flex sm:flex-row items-end sm:items-center sm:text-right gap-2 flex-wrap">
                                                <div
                                                    className={`text-xl sm:text-2xl font-semibold ${txn.type === "income"
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                        }`}
                                                >
                                                    ₹ {txn.amount}
                                                </div>
                                                <div className="text-gray-700 font-medium text-sm capitalize truncate">
                                                    ( {txn.name} )
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                                                <FaTag className="text-gray-400" />
                                                <span>
                                                    Category:{" "}
                                                    <span className="font-semibold capitalize">
                                                        {txn.category}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom: Right Section (on sm: left aligned again) */}
                                    <div className="flex flex-col sm:items-end justify-between gap-3 sm:text-right text-left">
                                        {/* Type */}
                                        <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:justify-end">
                                            <FaWallet
                                                className={`${txn.type === "income"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                    }`}
                                            />
                                            <span>
                                                Type:{" "}
                                                <span
                                                    className={`font-semibold capitalize ${txn.type === "income"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    {txn.type}
                                                </span>
                                            </span>
                                        </div>

                                        {/* Date + Action Buttons */}
                                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-wrap">
                                            <div className="text-xs text-txt">
                                                {new Date(txn.date).toLocaleString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Link
                                                    to={`/updatetransaction/${txn._id}`}
                                                    className="text-gray-500 hover:text-blue-600 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="text-base sm:text-lg" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(txn._id)}
                                                    className="text-gray-500 hover:text-red-600 transition hover:cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="text-base sm:text-lg" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-12 pb-10 px-3 sm:px-6 lg:pr-20">
                        <div className="border border-purple-400 rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-sm bg-white w-full gap-4 sm:gap-0">

                            {/* Text */}
                            <p className="text-sm sm:text-base font-semibold text-sectxt text-center sm:text-left">
                                Want to control your spending better?
                            </p>

                            {/* CTA Button */}
                            <Link
                                to="/setbudget"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-secondary text-secondary font-semibold rounded-xl hover:bg-secondary hover:text-white transition text-sm sm:text-base"
                            >
                                <FaMoneyBillWave className="text-lg sm:text-xl" />
                                <span className="leading-none">Set Budget</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`text-center mt-4 font-medium ${message.toLowerCase().includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
