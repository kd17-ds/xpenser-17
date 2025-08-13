import { createContext, useState, useEffect } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { BASE_URL } from "../constants/constants";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${BASE_URL}`,
    withCredentials: true,
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await client.get("/verifyUser");
                if (res.data.status) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Session restore failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const handleRegister = async (name, username, password, email) => {
        try {
            const res = await client.post("/signup", {
                name,
                username,
                password,
                email,
            });

            if (res.data.success && res.status === httpStatus.CREATED) {
                return res.data;
            } else {
                return {
                    success: false,
                    message: res.data?.message || "Signup failed",
                };
            }
        } catch (err) {
            return {
                success: false,
                message:
                    err?.response?.data?.message || "Something went wrong during signup",
            };
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const res = await client.post("/login", { email, password });

            if (res.data.success && res.status === httpStatus.OK && res.data.user) {
                setUser(res.data.user);

                return {
                    success: true,
                    message: res.data.message,
                    user: res.data.user,
                };
            }

            return {
                success: false,
                message: res.data.message || "Invalid credentials.",
            };
        } catch (err) {
            console.error("Login error:", err);
            return {
                success: false,
                message: err.response?.data?.message || "Login failed.",
            };
        }
    };

    const handleLogout = async () => {
        try {
            const res = await client.get("/logout");
            if (res.status === httpStatus.OK) {
                setUser(null);
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };


    const data = {
        user,
        setUser,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
