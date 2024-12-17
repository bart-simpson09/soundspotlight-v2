import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";

export const Dashboard: React.FC = () => {
    let location = useLocation();


    useEffect(() => {
        document.title = 'Dashboard';
        console.log("Location State:", location);
        const userData = location.state?.userData;
        if (userData) {
            console.log("User Data from Login:", userData);
        }
    }, [location]);

    return (
        <NavBar highlighted="home" />
    );
};
