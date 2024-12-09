import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import {ProtectedRoutes} from "./auth/ProtectedRoute";
import { NotFound } from './pages/NotFound';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
