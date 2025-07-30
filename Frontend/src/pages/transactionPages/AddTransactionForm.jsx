import React, { useState } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { BASE_URL } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const categories = [
    "Food",
    "Rent",
    "Travel",
    "Utilities",
    "Entertainment",
    "Grocery",
    "Shopping",
    "Healthcare",
    "Education",
    "Other",
];

export default function AddTransactionForm() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        category: "",
        name: "",
        date: new Date().toISOString().slice(0, 16),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/addTransaction`, formData, {
                withCredentials: true,
            });

            if (res.status === httpStatus.CREATED) {
                setMessage("Transaction added successfully!");
                navigate("/alltransactions");
            } else {
                setMessage("Failed to add transaction.");
            }
        } catch (err) {
            console.log("Failed to submit transaction:", err);
            setMessage("Failed to add transaction.");
        }
    };

    return (
        <div className="mt-12 px-4 sm:px-6 lg:px-40 w-full">
            <h2 className="text-3xl sm:text-4xl text-gray-800 mb-10 text-left">
                Add New Transaction :
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-semibold text-sectxt mb-2">
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="1"
                        className="w-full sm:w-60 border border-purple-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        required
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-semibold text-sectxt mb-2">
                        Type
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={formData.type === "income"}
                                onChange={handleChange}
                                className="accent-green-500 w-4 h-4"
                            />
                            <span className="text-gray-700">Income</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={formData.type === "expense"}
                                onChange={handleChange}
                                className="accent-red-500 w-4 h-4"
                            />
                            <span className="text-gray-700">Expense</span>
                        </label>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-sectxt mb-2">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full sm:w-72 border border-purple-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Name / Description */}
                <div>
                    <label className="block text-sm font-semibold text-sectxt mb-2">
                        Name / Description
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-purple-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        placeholder="e.g., Bought groceries"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-semibold text-sectxt mb-2">
                        Date
                    </label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full sm:w-72 border border-purple-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-secondary text-white py-3 px-6 rounded-xl font-semibold hover:bg-secondary/90 transition cursor-pointer"
                >
                    Add Transaction
                </button>

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
            </form>
        </div>
    );
}