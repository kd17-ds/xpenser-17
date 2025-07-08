import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

export default function AllTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

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
                            className={`rounded-xl border-l-4 shadow-md p-4 bg-white border ${txn.type === "income" ? "border-green-500" : "border-red-500"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className={`text-lg font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    ₹ {txn.amount}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(txn.date).toLocaleDateString()}{" "}
                                    {new Date(txn.date).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
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
        </div>
    );
}
