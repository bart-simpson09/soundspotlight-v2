import React, { useEffect } from "react";

export const YourFavorites: React.FC = () => {

    useEffect(() => {
        document.title = 'Your favorites';
    }, []);

    return (
        <div>
            <h1>Your favorites</h1>
        </div>
    );
};