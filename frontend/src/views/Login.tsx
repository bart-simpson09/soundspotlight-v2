import '../styles/reset.css'
import '../styles/fonts.css'
import '../styles/colors.css'
import '../styles/flex.css'
import '../styles/global.css'
import '../styles/components.css'
import '../styles/responsive.css'
import {useEffect} from "react";

const Login = () => {
    useEffect(() => {
        document.body.classList.add('singleFormBody');
    }, []);

    return (
        <div className="singleFormContainer flexColumn rowGap32">
            <div className="flexColumn rowGap16">
                <div className="flexColumn rowGap8">
                    <h1>Welcome back</h1>
                    <p>Please provide your details to enter the world.</p>
                </div>
                <span className="singleFormDivider"></span>
            </div>
            <form className="flexColumn rowGap32" onSubmit={Login} method="POST">
                <div className="flexColumn rowGap16">
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Enter your email"/>
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="password">Passowrd</label>
                        <input id="password" type="password" name="password" placeholder="Enter your password"/>
                    </div>
                    <div className="errorMessageContainer"></div>
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

export default Login;