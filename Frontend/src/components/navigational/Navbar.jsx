import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    const navLinks = [
        { name: "Budgets", path: "/allbudgets" },
        { name: "Transactions", path: "/alltransactions" },
        { name: "Insights", path: "/budgetvsexpensecomparison" },
        { name: "Analytics", path: "/transactionanalytics" },
    ];

    useEffect(() => {
        const handleClickOutside = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen]);

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

                {/* Mobile toggle button */}
                <div className="md:hidden px-2 sm:px-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen)
                        }}
                        className="text-txt hover:cursor-pointer "
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
                </div>
            </div>

            {/* Mobile Dropdown nav */}
            {isOpen && (
                <div className="md:hidden pt-2 pb-2 text-center bg-cards">
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
