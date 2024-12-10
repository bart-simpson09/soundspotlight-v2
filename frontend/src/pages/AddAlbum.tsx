import React, { useEffect } from "react";

export const AddAlbum: React.FC = () => {

    useEffect(() => {
        document.title = 'Add album';
    }, []);

    return (
        <div>
            <h1>Add album</h1>
        </div>
    );
};