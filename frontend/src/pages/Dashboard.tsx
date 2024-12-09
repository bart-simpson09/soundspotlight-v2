import React, { useEffect } from "react";
import { useAuth } from "../auth/AuthController";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>Hello on dashboard</h1>
            <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
                Logout
            </button>
        </div>
    );
};