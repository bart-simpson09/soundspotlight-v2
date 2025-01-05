import React, { useEffect } from "react";
import NavBar from "../components/navBar/NavBar";

export const YourFavorites: React.FC = () => {

    useEffect(() => {
        document.title = 'Your favorites';
        document.body.classList.remove("singleFormBody");
    }, []);

    return (
        <div>
            <NavBar highlighted="yourFavorites" />
            <h1>test</h1>
        </div>
    );
};