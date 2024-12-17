import React, { useEffect } from "react";
import NavBar from "../components/NavBar";

export const YourFavorites: React.FC = () => {

    useEffect(() => {
        document.title = 'Your favorites';
    }, []);

    return (
        <NavBar highlighted="yourFavorites" />
    );
};