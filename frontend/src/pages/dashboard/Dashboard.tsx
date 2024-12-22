import React, { useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useLocation } from "react-router-dom";
import {useDashboard} from "./UseDashboard";

export const Dashboard: React.FC = () => {
    let location = useLocation();
    const {authors, loading } = useDashboard();


    useEffect(() => {
        document.title = 'Dashboard';
        document.body.classList.remove("singleFormBody");
        //console.log("Location State:", location);
        const userData = location.state?.userData;
        if (userData) {
            //console.log("User Data from Login:", userData);
        }
    }, [location]);

    if (loading) {
        return (
            <div>
                Loading...
            </div>

            )
    }

    return (
        <>
            <NavBar highlighted="home" />
            <p>
                {authors?.map(author => author.name).join(', ')}
            </p>

        </>
    );
};