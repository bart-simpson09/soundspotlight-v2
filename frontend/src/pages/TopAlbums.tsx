import React, { useEffect } from "react";
import NavBar from "../components/NavBar";

export const TopAlbums: React.FC = () => {

    useEffect(() => {
        document.title = 'Top albums';
    }, []);

    return (
        <NavBar highlighted="topAlbums" />
    );
};