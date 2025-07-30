import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLoader } from "../contexts/LoadingContext";

export default function UserProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (loading) showLoader();
        else hideLoader();
    }, [loading]);

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ message: "You must log in first to access the Page." }} />;
    }

    return children;
}
