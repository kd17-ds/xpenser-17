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
        <div className="mt-12 px-4 sm:px-6 lg:px-40 w-full">
            <h2 className="text-3xl sm:text-4xl text-gray-800 mb-10 text-left">
                Set Monthly Budget :
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl">
                {/* Month & Year */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-sectxt mb-2">
                            Month
                        </label>
                        <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                            className="w-full border border-purple-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Select month</option>
                            {months.map((m, i) => (
                                <option key={i} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-sectxt mb-2">
                            Year
                        </label>
                        <input
                            type="number"
                            name="year"
                            placeholder="e.g. 2025"
                            min="2020"
                            max="2100"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="w-full border border-purple-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                </div>

                {/* Budget Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {categories.map((cat) => (
                        <div key={cat}>
                            <label className="block text-sm font-semibold text-sectxt mb-2">
                                {cat}
                            </label>
                            <input
                                type="number"
                                name={cat}
                                value={formData.categories[cat]}
                                onChange={handleChange}
                                placeholder="₹ 0"
                                min="0"
                                className="w-full border border-purple-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-secondary text-white py-3 px-6 rounded-xl font-semibold hover:bg-secondary/90 transition cursor-pointer"
                >
                    Submit Budget
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
