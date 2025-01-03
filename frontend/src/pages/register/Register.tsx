import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useRegister} from "./UseRegister";

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { loading, register } = useRegister();

    useEffect(() => {
        document.body.classList.add('singleFormBody');
        document.title = 'Register';
    }, [navigate]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatedPassword: ''
    })

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'firstName':
                if (!value.trim()) {
                    error = "First name is required";
                }
                break;
            case 'lastName':
                if (!value.trim()) {
                    error = "Last name is required";
                }
                break;
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
            case 'repeatedPassword':
                if (value !== formData.password || !value.trim()) {
                    error = "Passwords should match";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
            const {repeatedPassword, ...formDataToSubmit} = formData;
            const response = await register(formDataToSubmit);
            if (response) {
                if (response.errorField && response.message) {
                    setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        [response.errorField]: response.message
                    }));
                }
            }
        }
    };

    return (
        <div className="singleFormContainer flexColumn rowGap32">
            <div className="flexColumn rowGap16">
                <div className="flexColumn rowGap8">
                    <h1>Create an account</h1>
                    <p>It takes only a few steps to enter the music world!</p>
                </div>
                <span className="singleFormDivider"></span>
            </div>
            <form className="flexColumn rowGap32" onSubmit={handleSubmit} method="POST">
                <div className="flexColumn rowGap16">
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="firstName">First name</label>
                        <input id="firstName" type="text" name="firstName" placeholder="Enter your first name" onChange={handleChange} onBlur={handleBlur} className={validationErrors.firstName ? 'inputError' : ''}/>
                        {validationErrors.firstName && (<p className="errorMessageContainer">{validationErrors.firstName}</p>)}
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="lastName">Last name</label>
                        <input id="lastName" type="text" name="lastName" placeholder="Enter your last name" onChange={handleChange} onBlur={handleBlur} className={validationErrors.lastName ? 'inputError' : ''}/>
                        {validationErrors.lastName && (<p className="errorMessageContainer">{validationErrors.lastName}</p>)}
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter your email" onChange={handleChange} onBlur={handleBlur} className={validationErrors.email ? 'inputError' : ''}/>
                        {validationErrors.email && (<p className="errorMessageContainer">{validationErrors.email}</p>)}
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="password">Passowrd</label>
                        <input id="password" type="password" name="password" placeholder="Enter your password" onChange={handleChange} onBlur={handleBlur} className={validationErrors.password ? 'inputError' : ''}/>
                        {validationErrors.password && (<p className="errorMessageContainer">{validationErrors.password}</p>)}
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="repeatedPassword">Repeat passowrd</label>
                        <input id="repeatedPassword" type="password" name="repeatedPassword" placeholder="Enter your password again" onChange={handleChange} onBlur={handleBlur} className={validationErrors.repeatedPassword ? 'inputError' : ''}/>
                        {validationErrors.repeatedPassword && (<p className="errorMessageContainer">{validationErrors.repeatedPassword}</p>)}
                    </div>
                </div>
                <button type="submit" className="buttonPrimary" disabled={loading}>{loading ? "Processing..." : "Sign up"}</button>

            </form>
            <div className="flexRow columnGap4 flexCenter formFooter">
                <p>Already have an account?</p>
                <a href="/login">Sign in</a>
            </div>
        </div>
    );
}