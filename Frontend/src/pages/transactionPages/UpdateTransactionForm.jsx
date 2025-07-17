import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
    "Food", "Rent", "Travel", "Utilities", "Entertainment",
    "Grocery", "Shopping", "Healthcare", "Education", "Other"
];

export default function UpdateTransactionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        category: "",
        name: "",
        date: new Date().toISOString().slice(0, 16),
    });

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/updatetransaction/${id}`);
                const data = res.data;
                setFormData({
                    amount: data.amount,
                    type: data.type,
                    category: data.category,
                    name: data.name,
                    date: new Date(data.date).toISOString().slice(0, 16),
                });
            } catch (err) {
                console.error("Failed to fetch transaction:", err);
                setMessage("Failed to fetch transaction.");
            }
        };
        fetchTransaction();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/updatetransaction/${id}`, formData);
            setMessage("Transaction updated successfully!");
            navigate("/alltransactions");
        } catch (err) {
            console.error("Update failed:", err);
            setMessage("Failed to update transaction.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Update Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className="flex gap-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={formData.type === "income"}
                                onChange={handleChange}
                                className="form-radio text-green-500"
                            />
                            <span className="ml-2 text-gray-700">Income</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={formData.type === "expense"}
                                onChange={handleChange}
                                className="form-radio text-red-500"
                            />
                            <span className="ml-2 text-gray-700">Expense</span>
                        </label>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name / Description</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Bought groceries"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Update Transaction
                </button>
                {message && (
                    <div className={`text-center mt-4 font-medium ${message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
