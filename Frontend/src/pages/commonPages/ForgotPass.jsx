import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";

export default function ForgotPass() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState(""); // "success" or "error"

    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const handleSubmit = async () => {
        const token = new URLSearchParams(window.location.search).get("token");

        setMessage("");
        setType("");

        if (!token) {
            setMessage("Invalid or missing token.");
            setType("error");
            return;
        }

        if (!password || !confirmPassword) {
            setMessage("Please fill in both fields.");
            setType("error");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setType("error");
            return;
        }

        try {
            showLoader();
            const res = await axios.post(`${BASE_URL}/resetpass?token=${token}`, { password });

            setMessage(res.data.message || "Password reset successfully.");
            setType("success");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setMessage("Reset failed. Try again.");
            setType("error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    Reset Your Password
                </h2>

                {message && (
                    <div
                        className={`mb-4 px-4 py-2 rounded text-sm ${type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-sec text-white py-2 rounded hover:bg-lite transition"
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}
