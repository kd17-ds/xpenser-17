import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

export default function NotFoundPage() {
    return (
        <div className="min-h-[calc(100vh-225px)] flex flex-col items-center justify-center text-center bg-bg px-4">
            <div className="max-w-md p-8 bg-primary shadow-md rounded-2xl">
                <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-txt mb-2">Page Not Found</h2>
                <p className="text-sectxt text-sm mb-6 leading-relaxed">
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                    Let’s get you back on track.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm bg-secondary text-primary font-medium px-5 py-2.5 rounded-2xl hover:bg-lite transition"
                >
                    <FaArrowLeft /> Back to Home
                </Link>
            </div>
        </div>
    );
}
