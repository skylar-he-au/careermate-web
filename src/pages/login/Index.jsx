import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import {
    validatePassword,
    validateEmail,
    validateLogin,
} from "../../utils/validators";
import "./Index.scss";
import useField from "../../hooks/useField";

function mockLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                email === "test@test.com" &&
                password === "123456"
            ) {
                resolve('Login success');
            }
            else {
                reject(
                    new Error("Incorrect email or password")
                );
            }
        }, 1000);
    });
}

function Login() {
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle');
    const navigate = useNavigate();
    const {
        value: email,
        error: emailError,
        onChange: emailChange,
    } = useField(validateEmail);
    const {
        value: password,
        error: passwordError,
        onChange: passwordChange,
    } = useField(validatePassword);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const errMsg = validateLogin(email, password);

        if (errMsg) {
            setStatus("error");
            setError(errMsg);
            return;
        }

        try {
            setStatus("loading");

            await mockLogin(email, password);

            setStatus("success");
            navigate("/home");
        } catch (err) {
            setStatus("error");
            setError(err.message);
        }
    }

    return (
        <div className="login-container">
            <form
                onSubmit={handleSubmit}
                className="form-container"
            >
                <h2>CareerMate Login</h2>

                <TextInput
                    label="Email"
                    value={email}
                    onChange={emailChange}
                    error={emailError}
                    autoFocus={true}
                />

                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={passwordChange}
                    error={passwordError}
                />

                <button disabled={status === "loading"}>
                    {status === "loading" ? "Logging in..." : "Login"}
                </button>

                {status === "error" && (
                    <p className="form-error">{error}</p>
                )}

                {status === "success" && (
                    <p className="success-message">Login success ✅</p>
                )}

                <p className="auth-link">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;