import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const Login: React.FC = () => {
    useEffect(() => {
        document.body.classList.add('singleFormBody');
        document.title = 'Login';
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors: Record<string, string> = {};

        Object.keys(formData).forEach((field) => {
            const error = validateField(field as keyof typeof formData, formData[field as keyof typeof formData]);
            if (error) {
                errors[field] = error;
            }
        });

        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {

            axios
                .post('http://localhost:8080/auth/login', formData, { withCredentials: true })
                .then((response) => {
                    console.log('Login successful:', response.data);
                    navigate('/dashboard');
                })
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        const { status, data } = error.response || {};
                        if (status === 400) {
                            const validationErrors = data?.errors || [];
                            const mappedErrors: Record<string, string> = {};
                            validationErrors.forEach((err: { field: string; message: string }) => {
                                mappedErrors[err.field] = err.message;
                            });
                            setValidationErrors(mappedErrors);
                        } else if (status === 401) {
                            setValidationErrors({ email: 'Invalid email or password' });
                        } else {
                            console.error("Unexpected error during login:", error.message);
                        }
                    } else {
                        console.error("Error during login:", error);
                    }
                });
        }
    };


    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'email':
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Email is not valid";
                }
                break;
            case 'password':
                if (!value.trim()) {
                    error = "Password is required";
                }
                break;
            default:
                break;
        }
        return error;
    };

    return (
        <div className="singleFormContainer flexColumn rowGap32">
            <div className="flexColumn rowGap16">
                <div className="flexColumn rowGap8">
                    <h1>Welcome back</h1>
                    <p>Please provide your details to enter the world.</p>
                </div>
                <span className="singleFormDivider"></span>
            </div>
            <form className="flexColumn rowGap32" onSubmit={handleSubmit} method="POST">
                <div className="flexColumn rowGap16">
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter your email" onChange={handleChange} onBlur={handleBlur} className={validationErrors.email ? 'inputError' : ''}/>
                        {validationErrors.email && (<p className="errorMessageContainer">{validationErrors.email}</p>)}
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" placeholder="Enter your password" onChange={handleChange} onBlur={handleBlur} className={validationErrors.password ? 'inputError' : ''}/>
                        {validationErrors.password && (<p className="errorMessageContainer">{validationErrors.password}</p>)}
                    </div>
                </div>
                <button type="submit" className="buttonPrimary">Sign in</button>
            </form>
            <div className="flexRow columnGap4 flexCenter formFooter">
                <p>Don’t have an account? </p>
                <a href="/register">Sign up</a>
            </div>
        </div>
    );
}