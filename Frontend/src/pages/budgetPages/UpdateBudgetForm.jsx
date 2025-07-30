import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
    "Food", "Rent", "Travel", "Utilities", "Entertainment",
    "Grocery", "Shopping", "Healthcare", "Education", "Other"
];

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function UpdateBudgetForm() {
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
                const res = await axios.get(`${BASE_URL}/updatebudget/${id}`, {
                    withCredentials: true,
                });
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
            }, {
                withCredentials: true,
            });

            setMessage(res.data?.message);
            setTimeout(() => navigate("/allbudgets"), 1000);
        } catch (err) {
            console.error("Update failed:", err);
            setMessage("Failed to update Budget.");
        }
    };

    return (
        <div className="mt-12 px-4 sm:px-6 lg:px-40 w-full">
            <h2 className="text-3xl sm:text-4xl text-gray-800 mb-10 text-left">
                Update Budget :
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

                <button
                    type="submit"
                    className="w-full bg-secondary text-white py-3 px-6 rounded-xl font-semibold hover:bg-secondary/90 transition cursor-pointer"
                >
                    Update Budget
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