import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useSessionManager} from "../../utils/sessionManager";
import {API} from "../../utils/api";

export const useLogin = () => {
    const navigate = useNavigate();
    const sessionManager = useSessionManager();

    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const rawLogoutParam = searchParams.get('logout');
    const logoutParam = useMemo(() => {
        if (!rawLogoutParam) {
            return null;
        }

        const parsed = parseInt(rawLogoutParam);
        if (isNaN(parsed)) {
            return null;
        }

        return parsed;
    }, [rawLogoutParam]);

    useEffect(() => {
        if (logoutParam === 1) {
            console.log("logged out");
            // alert('You have been logged out');
            searchParams.delete('logout');
            setSearchParams(searchParams); // Update the URL


        }
    }, [logoutParam]);

    const loginUser = async (email: string, password: string ) => {
        try {
            setLoading(true);
            const response = await API(sessionManager).login(email, password);
            setLoading(false);
            sessionManager.setCurrentUser(response.data);
            navigate('/dashboard');
        } catch (error: any) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                const { status, data } = error.response || {};
                if (status === 400 && data?.errors) {
                    const validationErrors: Record<string, string> = {};
                    data.errors.forEach((err: { field: string; message: string }) => {
                        validationErrors[err.field] = err.message;
                    });
                    return { success: false, errors: validationErrors };
                } else if (status === 401) {
                    return { success: false, errors: { email: "Invalid email or password" } };
                }
            }
            console.error("Login error:", error);
            return { success: false, errors: { general: "Unexpected error occurred" } };
        }
    };

    return { loading, loginUser };
};