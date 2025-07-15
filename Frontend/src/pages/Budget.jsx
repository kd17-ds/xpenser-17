import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function Budget() {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [monthFilter, setMonthFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

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

    useEffect(() => {
        fetchBudget();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthFilter, yearFilter]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this Budget?");
        if (!confirm) return;
        try {
            let res = await axios.delete(`${BASE_URL}/deletebudget/${id}`);
            setBudgets((prev) => prev.filter(bgt => bgt._id !== id));
            setMessage(res.data?.message);
            setError("");
        } catch (err) {
            console.error("Error deleting Budget:", err);
            setError("Failed to delete Budget.");
            setMessage("");
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">All Budgets</h2>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                >
                    {months.map((m, i) => (
                        <option key={i} value={m}>
                            {m || "All Months"}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Year"
                    value={yearFilter}
                    min="2020"
                    max="2100"
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                />
                <button
                    onClick={() => {
                        setMonthFilter("");
                        setYearFilter("");
                    }}
                    className="bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200"
                >
                    Clear Filters
                </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {budgets.length === 0 ? (
                <p className="text-center text-gray-500">No budget entries found.</p>
            ) : (
                <div className="space-y-6">
                    {budgets.map((bgt) => (
                        <div key={`${bgt._id}`} className="p-4 border border-gray-200 rounded-xl bg-white shadow-md">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-semibold text-blue-600">
                                    {bgt.month} {bgt.year}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <Link
                                        to={`/updatebudget/${bgt._id}`}
                                        className="text-gray-500 hover:text-blue-600"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(bgt._id)}
                                        className="text-gray-500 hover:text-red-600"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                                {Object.entries(bgt.categories).map(([cat, amt]) => (
                                    <div key={cat} className="flex justify-between border-b py-1">
                                        <span className="font-medium">{cat}</span>
                                        <span className="text-right">₹ {amt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-6">
                <Link to={`/comparison`} className="text-blue-500 hover:underline">
                    Go to Comparison
                </Link>
            </div>

            {message && (
                <div className="text-center mt-4 font-medium text-green-600">
                    {message}
                </div>
            )}
        </div>
    );
}
