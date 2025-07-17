import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null); // track which link is hovered

    const navLinks = [
        { name: 'Transactions', path: '/alltransactions' },
        { name: 'Budgets', path: '/allbudgets' },
        { name: 'Budget vs. Comparison', path: '/budgetvsexpensecomparison' },
        { name: 'Transaction Analytics', path: '/transactionanalytics' },
    ];

    return (
        <nav className="shadow-md h-[80px] bg-surface w-full sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center h-full px-4">
                {/* Logo */}
                <Link to="/">
                    <img src="/assets/logo.svg" alt="Xpenser Logo" className="h-[60px]" />
                </Link>

                {/* Mobile toggle button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="focus:outline-none focus:ring-2 focus:ring-inset rounded text-inverted border border-secondary"
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
                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onMouseEnter={() => setHoveredLink(index)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={`text-lg font-medium transition-colors duration-200 ${hoveredLink === index ? 'text-danger' : 'text-secondary'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile nav */}
            {isOpen && (
                <div className="md:hidden pt-2 pb-4 space-y-1 bg-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-base font-medium transition-colors duration-200 text-inverted hover:bg-light"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
