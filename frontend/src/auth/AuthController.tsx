import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextProps {
    isAuthenticated: boolean;
    user: Record<string, any> | null;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthController = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<Record<string, any> | null>(null);

    const checkAuth = async () => {
        try {
            const response = await axios.get('http://localhost:8080/auth/check', { withCredentials: true });
            setIsAuthenticated(response.data.isAuthenticated);
            setUser(response.data.user || null);
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const login = () => {
        setIsAuthenticated(true);
        checkAuth();
    };

    const logout = async () => {
        await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthController.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
            {children}
        </AuthController.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthController);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};