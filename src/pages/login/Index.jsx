import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import { useAuth } from "../../contexts/AuthContext";
import useField from "../../hooks/useField";
import { validateEmail, validateLogin, validatePassword } from "../../utils/validators";
import "./Index.scss";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailField = useField(validateEmail, "test@test.com");
  const passwordField = useField(validatePassword, "123456");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateLogin(emailField.value, passwordField.value);

    if (validationError) {
      emailField.validate();
      passwordField.validate();
      setStatus("error");
      setError(validationError);
      return;
    }

    try {
      setStatus("loading");
      setError("");
      await Promise.resolve(login(emailField.value, passwordField.value));
      const destination = location.state?.from?.pathname || "/home";
      navigate(destination, { replace: true });
    } catch (loginError) {
      setStatus("error");
      setError(loginError.message);
    }
  }

  return (
    <main className="auth-page login-container">
      <section className="auth-brand-panel">
        <Link className="auth-logo" to="/login"><span>CM</span>CareerMate</Link>
        <div><span className="eyebrow light">PLAN · APPLY · PROGRESS</span><h1>Your job search deserves a better home.</h1><p>Discover opportunities, track applications and stay focused on what comes next.</p></div>
        <p className="auth-quote">“Small, consistent steps create remarkable careers.”</p>
      </section>

      <section className="auth-form-panel">
        <form onSubmit={handleSubmit} className="form-container" noValidate>
          <span className="mobile-logo">CareerMate</span>
          <div className="form-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Use the demo details below or your registered account.</p></div>

          <div className="demo-credentials"><strong>Demo account</strong><span>test@test.com</span><span>Password: 123456</span></div>

          <TextInput label="Email address" name="email" type="email" autoComplete="email" autoFocus {...emailField} />
          <TextInput label="Password" name="password" type="password" autoComplete="current-password" {...passwordField} />

          {status === "error" && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button submit-button" disabled={status === "loading"}>{status === "loading" ? "Signing in…" : "Sign in"}</button>
          <p className="auth-link">New to CareerMate? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}

export default Login;
