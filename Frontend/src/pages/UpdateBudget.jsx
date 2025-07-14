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
        month: "",
        year: "",
        categories: categories.reduce((acc, cat) => {
            acc[cat] = ""; // allow empty strings
            return acc;
        }, {})
    });

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/updatebudget/${id}`);
                const data = res.data;

                setFormData({
                    month: data.month,
                    year: data.year,
                    categories: categories.reduce((acc, cat) => {
                        acc[cat] = data.categories[cat]?.toString() || ""; // keep as string for controlled input
                        return acc;
                    }, {}),
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

        if (categories.includes(name)) {
            setFormData((prev) => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [name]: value, // do not convert to number here
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

        const numericCategories = Object.fromEntries(
            Object.entries(formData.categories).map(([cat, amt]) => [cat, Number(amt || 0)])
        );

        try {
            const res = await axios.put(`${BASE_URL}/updatebudget/${id}`, {
                month: formData.month,
                year: formData.year,
                categories: numericCategories,
            });

            setMessage(res.data?.message);
            setTimeout(() => navigate("/budget"), 1000);
        } catch (err) {
            console.error("Update failed:", err);
            setMessage("Failed to update Budget.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Update Monthly Budget</h2>

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

                <button
                    type="submit"
                    className="w-full py-3 mt-6 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Update Budget
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
