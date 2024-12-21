import React, { useEffect } from "react";
import NavBar from "../components/NavBar";

export const AdminConsole: React.FC = () => {

    useEffect(() => {
        document.title = 'Admin console';
        document.body.classList.remove("singleFormBody");
    }, []);

    return (
        <NavBar highlighted="adminConsole" />
    );
};