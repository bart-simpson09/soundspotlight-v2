import React, {useEffect} from "react";

export const Login: React.FC = () => {
    useEffect(() => {
        document.title = 'Dashboard';
    }, []);
    return (
        <div>
           <h1>Hello on dashboard</h1>
        </div>
    );
}