import React, { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLoader } from "../../contexts/LoadingContext";
import { BASE_URL } from "../../constants/constants";
import axios from "axios";

export default function Authentication({ formType }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [formState, setFormState] = useState(formType === "signup" ? 1 : 0);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { handleRegister, handleLogin } = useAuth();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (location.pathname === "/signup") setFormState(1);
        else if (location.pathname === "/login") setFormState(0);
    }, [location.pathname]);

    useEffect(() => {
        if (location?.state?.message) {
            setMessage(location.state.message);
            // clear message so it doesn’t persist after refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleToggle = (state) => {
        setFormState(state);
        navigate(state === 0 ? "/login" : "/signup");
        setMessage("");
    };

    const handleAuth = async () => {
        setMessage("");
        try {
            showLoader();

            if (formState === 0) {
                const res = await handleLogin(email, password);
                // now res is already res.data
                if (res.success) {
                    const { message: msg, user: loggedInUser } = res;
                    if (!loggedInUser?.verified) {
                        setMessage("Please verify your email before logging in.");
                        return;
                    }
                    setMessage(msg || "Login successful!");
                    navigate("/");
                } else {
                    setMessage(res.message || "Login failed.");
                    return;
                }
            }

            if (formState === 1) {
                const res = await handleRegister(name, username, password, email);

                if (res?.data?.success) {
                    setMessage("Signup successful. Check your email for verification.");
                    setFormState(0);
                    navigate("/login");
                } else {
                    setMessage(res?.data?.message || "Signup failed.");
                }
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage(err.message || "An error occurred.");
            }
        } finally {
            hideLoader();
        }
    };

    const passChange = async () => {
        if (!email) {
            setMessage("Please enter your email to reset password.");
            return;
        }

        try {
            showLoader();
            const res = await axios.post(`${BASE_URL}/forgotpass`, { email });

            if (res?.data?.success) {
                setMessage(res.data.message || "Reset link sent to your email.");
            } else {
                setMessage(res?.data?.message || "Unable to process request.");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="min-h-[calc(100vh-225px)] pt-[75px] flex items-center justify-center px-4 ">
            <div className="w-full max-w-md bg-cards p-8 rounded shadow">
                <div className="flex flex-col items-center">
                    <div className="bg-secondary text-primary p-4 rounded-full mb-4">
                        <LockOutlinedIcon className="w-6 h-6" />
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => handleToggle(0)}
                            className={`hover:cursor-pointer px-4 py-2 font-medium rounded ${formState === 0 ? "bg-secondary text-primary" : "bg-cards text-txt"}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => handleToggle(1)}
                            className={`hover:cursor-pointer px-4 py-2 font-medium rounded ${formState === 1 ? "bg-secondary text-primary" : "bg-cards text-txt"}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {message && (
                        <div className="text-sm text-center mb-4 text-red-600 font-medium">
                            {message}
                        </div>
                    )}

                    <form className="w-full space-y-4">
                        {formState === 1 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-txt bg-primary"
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-txt bg-primary"
                                />
                            </>
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-txt bg-primary"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-txt bg-primary"
                        />

                        {formState === 0 && (
                            <div className="w-full text-left">
                                <button
                                    type="button"
                                    className="text-blue-600 text-sm hover:underline hover:cursor-pointer"
                                    onClick={passChange}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleAuth}
                            className="w-full bg-secondary text-primary py-2 rounded hover:bg-lite transition hover:cursor-pointer"
                        >
                            {formState === 0 ? "Login" : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}
