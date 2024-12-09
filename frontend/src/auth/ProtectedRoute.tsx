import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthController';

export const ProtectedRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};