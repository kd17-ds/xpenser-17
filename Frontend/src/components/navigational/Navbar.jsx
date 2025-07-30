import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // Separate refs for mobile and desktop profile dropdown containers
    const profileRefMobile = useRef();
    const profileRefDesktop = useRef();
    const toggleButtonRef = useRef();

    const navLinks = [
        { name: "Budgets", path: "/allbudgets" },
        { name: "Transactions", path: "/alltransactions" },
        { name: "Insights", path: "/budgetvsexpensecomparison" },
        { name: "Analytics", path: "/transactionanalytics" },
    ];

    const getInitials = (name, username) => {
        const str = name?.trim() || username?.trim() || "";
        if (!str) return "";
        const parts = str.split(" ");
        if (parts.length === 1) {
            return (parts[0][0] || "").toUpperCase() + (parts[0][1] || "").toUpperCase();
        }
        return (parts[0][0] || "").toUpperCase() + (parts[1][0] || "").toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close mobile menu if clicking outside of menu and toggle button
            if (isOpen) {
                const mobileMenu = document.getElementById("mobile-menu");
                if (
                    mobileMenu &&
                    !mobileMenu.contains(event.target) &&
                    toggleButtonRef.current &&
                    !toggleButtonRef.current.contains(event.target)
                ) {
                    setIsOpen(false);
                }
            }

            // Close profile dropdown only if clicking outside both profile dropdowns
            if (
                showProfileDropdown &&
                !(
                    (profileRefDesktop.current && profileRefDesktop.current.contains(event.target)) ||
                    (profileRefMobile.current && profileRefMobile.current.contains(event.target))
                )
            ) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, showProfileDropdown]);

    const handleLogout = async () => {
        try {
            await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
            setUser(null);
            setShowProfileDropdown(false);
            setIsOpen(false);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav className="shadow-md h-[80px] bg-primary w-full sticky top-0 z-50">
            <div className="flex justify-between items-center h-full px-3 sm:px-6">
                <NavLink to="/" onClick={() => setIsOpen(false)}>
                    <img
                        src="/assets/logo.svg"
                        alt="Xpenser Logo"
                        className="h-[40px] sm:h-[50px]"
                    />
                </NavLink>

                {/* Mobile profile icon + toggle button side by side */}
                <div className="md:hidden flex items-center space-x-4">
                    {user && (
                        <div
                            className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center cursor-pointer text-sm font-semibold uppercase relative"
                            ref={profileRefMobile}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfileDropdown((prev) => !prev);
                            }}
                        >
                            {getInitials(user.name, user.username)}

                            {showProfileDropdown && (
                                <div className="absolute right-0 top-[60px] mt-2 w-64 bg-primary shadow-lg rounded-md z-50 px-4 py-3 text-left">
                                    <p className="text-sm text-txt font-semibold mb-1">{user.name}</p>
                                    <p className="text-sm text-txt mb-1 lowercase">{user.username ? user.username.toLowerCase() : ""}</p>
                                    <p className="text-sm text-sectxt mb-3 lowercase">{user.email ? user.email.toLowerCase() : ""}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded w-full transition duration-150"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        ref={toggleButtonRef}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen((prev) => !prev);
                        }}
                        className="text-txt hover:cursor-pointer"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex space-x-8 px-4">
                    <div className="flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                onMouseEnter={() => setHoveredLink(index)}
                                onMouseLeave={() => setHoveredLink(null)}
                                className={({ isActive }) =>
                                    `text-base font-medium transition-colors duration-200 ${isActive
                                        ? "text-secondary underline underline-offset-6"
                                        : hoveredLink === index
                                            ? "text-secondary"
                                            : "text-txt"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {user && (
                            <div
                                className="ml-4 w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center cursor-pointer text-sm font-semibold uppercase relative"
                                ref={profileRefDesktop}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProfileDropdown((prev) => !prev);
                                }}
                            >
                                {getInitials(user.name, user.username)}

                                {showProfileDropdown && (
                                    <div className="absolute right-0 top-[60px] mt-2 w-64 bg-cards shadow-lg rounded-md z-50 px-4 py-3 text-left">
                                        <p className="text-sm text-txt font-semibold mb-1">{user.name}</p>
                                        <p className="text-sm text-txt mb-1 lowercase">{user.username}</p>
                                        <p className="text-sm text-sectxt mb-3 lowercase">{user.email}</p>
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded w-full transition duration-150"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown nav */}
            {isOpen && (
                <div
                    id="mobile-menu"
                    className="md:hidden pt-2 pb-2 text-center bg-cards"
                >
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-base font-base transition-colors duration-200 text-txt hover:bg-secondary"
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    );
}
