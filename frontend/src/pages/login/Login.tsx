import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useLogin } from "./UseLogin";

export const Login: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const { loading, loginUser } = useLogin();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("singleFormBody");
        document.title = "Login";
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateField = (name: string, value: string) => {
        if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        return "";
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValidationErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors: Record<string, string> = {};
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value);
            if (error) errors[key] = error;
        });

        if (Object.keys(errors).length === 0) {
            const result = await loginUser(formData);
            if (result.success) {
                login();
                navigate("/dashboard");
            } else if (result.errors) {
                setValidationErrors(result.errors);
            }
        } else {
            setValidationErrors(errors);
        }
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
                        <input id="email" type="email" name="email" placeholder="Enter your email"
                               onChange={handleChange} onBlur={handleBlur}
                               className={validationErrors.email ? 'inputError' : ''}/>
                        {validationErrors.email && (<p className="errorMessageContainer">{validationErrors.email}</p>)}
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" placeholder="Enter your password"
                               onChange={handleChange} onBlur={handleBlur}
                               className={validationErrors.password ? 'inputError' : ''}/>
                        {validationErrors.password && (
                            <p className="errorMessageContainer">{validationErrors.password}</p>)}
                    </div>
                </div>
                <button type="submit" className="buttonPrimary" disabled={loading}>{loading ? "Processing..." : "Sign in"}</button>
            </form>
            <div className="flexRow columnGap4 flexCenter formFooter">
                <p>Don’t have an account? </p>
                <a href="/register">Sign up</a>
            </div>
        </div>
    );
};
