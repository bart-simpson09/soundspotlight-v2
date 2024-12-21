import React, { useEffect } from "react";
import NavBar from "../components/NavBar";

export const MyProfile: React.FC = () => {

    useEffect(() => {
        document.title = 'My profile';
        document.body.classList.remove("singleFormBody");
    }, []);

    return (
        <div>
            <NavBar highlighted="none" />
            <h1>My Profile</h1>
        </div>
    );
};