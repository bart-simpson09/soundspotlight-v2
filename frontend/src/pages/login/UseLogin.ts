import { useState } from "react";
import axios from "axios";

interface UseLoginResult {
    loading: boolean;
    loginUser: (credentials: { email: string; password: string }) => Promise<{ success: boolean; errors?: Record<string, string> }>;
}

export const useLogin = (): UseLoginResult => {
    const [loading, setLoading] = useState(false);

    const loginUser = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/auth/login", credentials, { withCredentials: true });
            return { success: true };
        } catch (error: any) {
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
        } finally {
            setLoading(false);
        }
    };

    return { loading, loginUser };
};