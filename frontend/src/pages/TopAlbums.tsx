import React, { useEffect } from "react";
import NavBar from "../components/navBar/NavBar";

export const TopAlbums: React.FC = () => {

    useEffect(() => {
        document.title = 'Top albums';
        document.body.classList.remove("singleFormBody");
    }, []);

    return (
        <NavBar highlighted="topAlbums" />
    );
};