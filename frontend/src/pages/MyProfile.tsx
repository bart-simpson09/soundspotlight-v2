import React, { useEffect } from "react";

export const MyProfile: React.FC = () => {

    useEffect(() => {
        document.title = 'My profile';
    }, []);

    return (
        <div>
            <h1>My Profile</h1>
        </div>
    );
};