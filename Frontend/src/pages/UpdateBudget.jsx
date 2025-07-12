import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
    "Food", "Rent", "Travel", "Utilities", "Entertainment",
    "Grocery", "Shopping", "Healthcare", "Education", "Other"
];

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function UpdateBudget() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        month: "",
        year: "",
    });

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/updatebudget/${id}`);
                const data = res.data;
                setFormData({
                    amount: data.amount,
                    category: data.category,
                    month: data.month,
                    year: data.year,
                });
            } catch (err) {
                console.error("Failed to fetch Budget:", err);
                setMessage("Failed to fetch Budget.");
            }
        };
        fetchBudget();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/updatebudget/${id}`, formData);
            setMessage("Budget updated successfully!");
            navigate("/budget");
        } catch (err) {
            console.error("Update failed:", err);
            setMessage("Failed to update Budget.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Update Monthly Budget</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Month & Year */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">Month</label>
                        <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select month</option>
                            {months.map((m, i) => (
                                <option key={i} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">Year</label>
                        <input
                            type="number"
                            name="year"
                            placeholder="e.g. 2025"
                            min="2020"
                            max="2100"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Update Budget
                </button>

                {/* Message */}
                {message && (
                    <div className={`text-center text-sm mt-2 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
