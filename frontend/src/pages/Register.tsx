import React, {useEffect} from "react";

export const Register: React.FC = () => {
    useEffect(() => {
        document.body.classList.add('singleFormBody');
        document.title = 'Register';
    }, []);

    return (
        <div className="singleFormContainer flexColumn rowGap32">
            <div className="flexColumn rowGap16">
                <div className="flexColumn rowGap8">
                    <h1>Create an account</h1>
                    <p>It takes only a few steps to enter the music world!</p>
                </div>
                <span className="singleFormDivider"></span>
            </div>
            <form className="flexColumn rowGap32" onSubmit={Register} method="POST">
                <div className="flexColumn rowGap16">
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="firstName">First name</label>
                        <input id="firstName" type="text" name="firstName" placeholder="Enter your first name"/>
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="lastName">Last name</label>
                        <input id="lastName" type="text" name="lastName" placeholder="Enter your last name"/>
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter your email"/>
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="password">Passowrd</label>
                        <input id="password" type="password" name="password" placeholder="Enter your password"/>
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="repeatedPassword">Repeat passowrd</label>
                        <input id="repeatedPassword" type="password" name="repeatedPassword" placeholder="Enter your password again"/>
                    </div>
                    <div className="errorMessageContainer"></div>
                </div>
                <button type="submit" className="buttonPrimary">Sign up</button>
            </form>
            <div className="flexRow columnGap4 flexCenter formFooter">
                <p>Already have an account?</p>
                <a href="/login">Sign in</a>
            </div>
        </div>
    );
}