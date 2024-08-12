import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, to, shouldBeAuthenticated }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated && !shouldBeAuthenticated) {
        return <Navigate to={to} />;
    }

    if (!isAuthenticated && shouldBeAuthenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
