import React, { useEffect } from "react";

export const AlbumDetails: React.FC = () => {

    useEffect(() => {
        document.title = 'Album detailse';
    }, []);

    return (
        <div>
            <h1>Album details</h1>
        </div>
    );
};