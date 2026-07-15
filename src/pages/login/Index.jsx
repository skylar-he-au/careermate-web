import './Index.css';

function Login() {
    return (
        <div className="login-page">
            <h1>Login</h1>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
        </div>
    );
}

export default Login;