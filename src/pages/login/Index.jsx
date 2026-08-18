import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import useField from "../../hooks/useField";
import { clearAuthError, loginUser } from "../../store/authSlice";
import { validateEmail, validateLogin, validatePassword } from "../../utils/validators";
import "./Index.scss";

function Login() {
  const dispatch = useDispatch();
  const { user, token, status, error: apiError } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const emailField = useField(validateEmail);
  const passwordField = useField(validatePassword);
  const [validationError, setValidationError] = useState("");
  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    if (isAuthenticated && status === "idle") navigate("/home", { replace: true });
  }, [isAuthenticated, navigate, status]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateLogin(emailField.value, passwordField.value);

    if (validationError) {
      emailField.validate();
      passwordField.validate();
      setValidationError(validationError);
      return;
    }

    try {
      setValidationError("");
      await dispatch(
        loginUser({ email: emailField.value, password: passwordField.value })
      ).unwrap();
      const destination = location.state?.from?.pathname || "/home";
      navigate(destination, { replace: true });
    } catch {}
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
          <div className="form-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Use the account registered with the CareerMate API.</p></div>

          <TextInput label="Email address" name="email" type="email" autoComplete="email" autoFocus {...emailField} />
          <TextInput label="Password" name="password" type="password" autoComplete="current-password" {...passwordField} />

          {(validationError || apiError) && <p className="form-error" role="alert">{validationError || apiError}</p>}
          <button className="primary-button submit-button" disabled={status === "loading"}>{status === "loading" ? "Signing in…" : "Sign in"}</button>
          <p className="auth-link">New to CareerMate? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}

export default Login;
