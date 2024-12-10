import React, { useEffect } from "react";

export const AdminConsole: React.FC = () => {

    useEffect(() => {
        document.title = 'Admin console';
    }, []);

    return (
        <div>
            <h1>Admin console</h1>
        </div>
    );
};