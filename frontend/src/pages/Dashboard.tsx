import React, {useEffect} from "react";
import NavBar from "../components/NavBar";

export const Dashboard: React.FC = () => {

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);


    return (
        <NavBar highlighted="home" />
    );
};