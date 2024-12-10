import React, { useEffect } from "react";

export const TopAlbums: React.FC = () => {

    useEffect(() => {
        document.title = 'Top albums';
    }, []);

    return (
        <div>
            <h1>Top albums</h1>
        </div>
    );
};