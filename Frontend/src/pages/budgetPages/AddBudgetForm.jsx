import React, { useState } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { BASE_URL } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const categories = [
    "Food", "Rent", "Travel", "Utilities", "Entertainment",
    "Grocery", "Shopping", "Healthcare", "Education", "Other"
];

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function AddBudgetForm() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        month: "",
        year: "",
        categories: categories.reduce((acc, cat) => {
            acc[cat] = ""; // allow empty strings while typing
            return acc;
        }, {})
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (categories.includes(name)) {
            setFormData((prev) => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [name]: value, // don't convert to number yet
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert category values to numbers (fallback to 0 if empty)
        const numericCategories = Object.fromEntries(
            Object.entries(formData.categories).map(([cat, amt]) => [cat, Number(amt || 0)])
        );

        const payload = {
            ...formData,
            categories: numericCategories,
        };

        try {
            const res = await axios.post(`${BASE_URL}/setbudget`, payload);

            if (res.status === httpStatus.CREATED) {
                console.log(res.data?.message);
                setMessage(res.data?.message);
                setTimeout(() => navigate("/allbudgets"), 1000);
            } else {
                setMessage("Failed to set budget.");
            }
        } catch (err) {
            console.log("Failed to submit budget:", err);
            setMessage(err.response?.data?.error || "Failed to set budget.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Set Monthly Budget</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Month & Year */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-medium mb-1">Month</label>
                        <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select month</option>
                            {months.map((m, i) => (
                                <option key={i} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block font-medium mb-1">Year</label>
                        <input
                            type="number"
                            name="year"
                            placeholder="e.g. 2025"
                            min="2020"
                            max="2100"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Budget for each category */}
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <div key={cat}>
                            <label className="block text-gray-700 font-medium mb-1">{cat}</label>
                            <input
                                type="number"
                                name={cat}
                                value={formData.categories[cat]}
                                onChange={handleChange}
                                placeholder="₹ 0"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 mt-6 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Submit Budget
                </button>

                {/* Feedback Message */}
                {message && (
                    <div className={`text-center text-sm mt-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
