import React, { useEffect } from "react";
import NavBar from "../components/navBar/NavBar";

export const AddAlbum: React.FC = () => {

    useEffect(() => {
        document.title = 'Add album';
        document.body.classList.remove("singleFormBody");
    }, []);

    return (
        <div>
            <NavBar highlighted="none" />
            <h1>Add album</h1>
        </div>
    );
};