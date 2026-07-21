import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import {
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateRegister,
} from "../../utils/validators";
import "./Index.scss";
import useField from "../../hooks/useField";

function mockRegister(name, email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

function RegisterButton({ status }) {
    return (
        <button disabled={status === "loading"}>
            {status === "loading"
                ? "Creating account..."
                : "Register"}
        </button>
    );
}

function RegisterMessage({ status, error }) {
    return (
        <>
            {status === "error" && (
                <p className="form-error">
                    {error}
                </p>
            )}

            {status === "success" && (
                <p className="success-message">
                    Register success ✅ Redirecting to
                    login...
                </p>
            )}
        </>
    );
}

function AuthLink({ onLoginClick }) {
    return (
        <p className="auth-link">
            Already have an account?{" "}
            <span onClick={onLoginClick}>
                Login
            </span>
        </p>
    );
}

export default function Register() {
    const {
        value: name,
        error: nameError,
        onChange: nameChange,
    } = useField(validateName);
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
    const {
        value: confirmPassword,
        error: confirmPasswordError,
        onChange: confirmPasswordChange,
    } = useField((v) => validateConfirmPassword(v, password));
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const errMsg = validateRegister(
            name,
            email,
            password,
            confirmPassword
        );

        if (errMsg) {
            setStatus("error");
            setError(errMsg);
            return;
        }

        try {
            setStatus("loading");

            await mockRegister(
                name,
                email,
                password
            );

            setStatus("success");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            setStatus("error");
            setError(err.message);
        }
    }

    return (
        <div className="register-container">
            <form
                onSubmit={handleSubmit}
                className="form-container"
            >
                <h2>CareerMate Register</h2>

                <TextInput
                    label="Name"
                    value={name}
                    onChange={nameChange}
                    error={nameError}
                    autoFocus = {true}
                />

                <TextInput
                    label="Email"
                    value={email}
                    onChange={emailChange}
                    error={emailError}
                />

                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={passwordChange}
                    error={passwordError}
                />

                <TextInput
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={confirmPasswordChange}
                    error={confirmPasswordError}
                />

                <RegisterButton status={status} />

                <RegisterMessage
                    status={status}
                    error={error}
                />

                <AuthLink
                    onLoginClick={() => navigate("/")}
                />
            </form>
        </div>
    );
}
