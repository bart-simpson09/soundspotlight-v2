import { useNavigate } from 'react-router-dom';
import { API, RegisterDto } from '../../utils/api';
import {useEffect, useState} from 'react';
import {useSessionManager} from "../../utils/sessionManager";

export const useRegister = () => {
    const navigate = useNavigate();
    const sessionManager = useSessionManager();

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (sessionManager.currentUser) {
            navigate('/dashboard');
        }

        if(!sessionManager.currentUser){
            return;
        }
    });

    const register = async (dto: RegisterDto) => {
        try {
            setLoading(true);
            const response = await API(sessionManager).users().register(dto);
            setLoading(false);
            sessionManager.setCurrentUser(response.data);
            navigate('/');
        } catch (error: any) {
            setLoading(false);
            let errorObject: { errorField: string; message: string } = { errorField: "", message: "" };

            if (error.response?.status === 400) {
                    errorObject.errorField = "password";
                    errorObject.message = error.response.data.errors[0].message;
                    return errorObject;

                } else if (error.response?.status === 409) {
                errorObject.errorField = "email";
                errorObject.message = "User with this email already exists";

                return errorObject;

                } else {
                    console.error("Unexpected error during registration:", error.response?.data || error.message);
                }

        }
    };

    return { loading, register };
};