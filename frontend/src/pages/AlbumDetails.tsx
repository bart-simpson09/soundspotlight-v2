import React, { useEffect } from "react";
import NavBar from "../components/NavBar";

export const AlbumDetails: React.FC = () => {

    useEffect(() => {
        document.title = 'Album detailse';
    }, []);

    return (
        <div>
            <NavBar highlighted="none" />
            <h1>Album details</h1>
        </div>
    );
};