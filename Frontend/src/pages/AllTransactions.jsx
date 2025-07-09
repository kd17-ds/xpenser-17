import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AllTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/allTransactions`);
                setTransactions(res.data.reverse());
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError("Failed to load transactions.");
            }
        };

        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirm) return;
        try {
            await axios.delete(`${BASE_URL}/deleteTransaction/${id}`)
            setTransactions((prev) => prev.filter(txn => txn._id !== id));
            setMessage("Transaction deleted successfully!");
            setError("");
        } catch (err) {
            console.error("Error deleting transaction:", err);
            setError("Failed to delete transaction.");
            setMessage("");
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                All Transactions
            </h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {transactions.length === 0 ? (
                <p className="text-center text-gray-500">No transactions to show.</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((txn) => (
                        <div
                            key={txn._id}
                            className={`relative rounded-xl border-l-4 shadow-md p-4 bg-white border ${txn.type === "income" ? "border-green-500" : "border-red-500"
                                } group`}
                        >
                            <div className="absolute top-3 right-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    to={`/updatetransaction/${txn._id}`}
                                    className="text-gray-400 hover:text-blue-600"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDelete(txn._id)}
                                    className="text-gray-400 hover:text-red-600"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className={`text-lg font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    ₹ {txn.amount}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(txn.date).toLocaleString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </span>
                            </div>

                            <div className="text-gray-700 mb-1 font-medium">{txn.name}</div>

                            <div className="flex justify-between text-sm text-gray-600">
                                <span className="capitalize">Type: {txn.type}</span>
                                <span>Category: {txn.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
