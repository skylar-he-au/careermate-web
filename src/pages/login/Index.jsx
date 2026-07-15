import React, { useState, useEffect, useRef } from 'react';
import './Index.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    function emailChange(e) {
        const value = e.target.value;
        setEmail(value);

        if (!value.trim()) {
            setEmailError('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Invalid email format');
        } else if (value.length > 50) {
            setEmailError('Email must be less than 50 characters');
        } else {
            setEmailError('');
        }
    }

    function passwordChange(e) {
        const value = e.target.value;
        setPassword(value);

        if (!value.trim()) {
            setPasswordError('Password is required');
        } else if (value.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else if (value.length > 20) {
            setPasswordError('Password must be less than 20 characters')
        } else {
            setPasswordError('');
        }
    }

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

    async function handleLogin() {
        setError("");
        setStatus("loading");
        try {
            const message = await mockLogin(email, password);
            setStatus(message);
        }
        catch (err) {
            setStatus("error");
            setError(err.message);
        }
    }

    return (
        <div className="login-container">
            <div className="formcontainer">
                <h2>creerMate login</h2>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={emailChange}
                />
                {emailError && <p className="error-massage">{emailError}</p>}
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={passwordChange}
                />
                {passwordError && <p className='error-massage'>{passwordError}</p>}

                <button onClick={handleLogin}>
                    {status === "loading" ? "Logging in..." : "Login"}
                </button>
                {status === "error" && <p className="error-message">{error}</p>}
                {status === "Login success" && <p className="success-massage">Login Success</p>}
            </div>
        </div>
    );
}

export default Login;