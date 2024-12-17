import { useNavigate } from 'react-router-dom';
import { API, RegisterDto } from '../../utils/api';
import { useState } from 'react';

export const useRegister = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    const register = async (dto: RegisterDto) => {
        try {
            setLoading(true);
            const response = await API().register(dto);
            setLoading(false);
            navigate('/login');
            alert("Registration successful! Now you can log in.");
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