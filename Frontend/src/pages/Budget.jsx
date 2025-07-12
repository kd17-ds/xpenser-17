import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Budget() {
    const [budget, setBudget] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/showbudget`);
                setBudget(res.data.reverse());
            } catch (err) {
                console.error("Error fetching Budget:", err);
                setError("Failed to load Budget.");
            }
        };

        fetchBudget();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this Budget?");
        if (!confirm) return;
        try {
            await axios.delete(`${BASE_URL}/deletebudget/${id}`)
            setBudget((prev) => prev.filter(bgt => bgt._id !== id));
            setMessage("Budget deleted successfully!");
            setError("");
        } catch (err) {
            console.error("Error deleting Budget:", err);
            setError("Failed to delete Budget.");
            setMessage("");
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">All Budgets</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {budget.length === 0 ? (
                <p className="text-center text-gray-500">No budget entries found.</p>
            ) : (
                <div className="space-y-4">
                    {budget.map((bgt) => (
                        <div
                            key={bgt._id}
                            className="relative rounded-xl border-l-4 border-blue-500 shadow-md p-4 bg-white group"
                        >
                            <div className="absolute top-3 right-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    to={`/updatebudget/${bgt._id}`}
                                    className="text-gray-400 hover:text-blue-600"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDelete(bgt._id)}
                                    className="text-gray-400 hover:text-red-600"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold text-blue-600">₹ {bgt.amount}</span>
                                <span className="text-sm text-gray-500">
                                    {bgt.month} {bgt.year}
                                </span>
                            </div>

                            <div className="text-gray-700 font-medium mb-1">Category: {bgt.category}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-6">
                <Link to={`/analytics`} className="text-blue-500 hover:underline">
                    Go to Analytics
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
