import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import useField from "../../hooks/useField";
import { clearAuthError, registerUser } from "../../store/authSlice";
import { validateConfirmPassword, validateEmail, validateName, validatePassword, validateRegister } from "../../utils/validators";
import "./Index.scss";

export default function Register() {
  const dispatch = useDispatch();
  const { status, error: apiError } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const nameField = useField(validateName);
  const emailField = useField(validateEmail);
  const passwordField = useField(validatePassword);
  const confirmPasswordField = useField((value) => validateConfirmPassword(value, passwordField.value));
  const [validationError, setValidationError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateRegister(nameField.value, emailField.value, passwordField.value, confirmPasswordField.value);

    if (validationError) {
      nameField.validate(); emailField.validate(); passwordField.validate(); confirmPasswordField.validate();
      setValidationError(validationError); return;
    }

    try {
      setValidationError("");
      await dispatch(registerUser({ name: nameField.value, email: emailField.value, password: passwordField.value })).unwrap();
      setRegistered(true);
      window.setTimeout(() => navigate("/login", { replace: true }), 700);
    } catch {}
  }

  return (
    <main className="auth-page register-container">
      <section className="auth-brand-panel register-brand">
        <Link className="auth-logo" to="/login"><span>CM</span>CareerMate</Link>
        <div><span className="eyebrow light">YOUR NEXT MOVE</span><h1>Turn career goals into a clear plan.</h1><p>Create one workspace for roles you love and the applications that move you forward.</p></div>
        <div className="benefit-list"><span>✓ Curated job discovery</span><span>✓ Simple application tracking</span><span>✓ A profile built around your goals</span></div>
      </section>

      <section className="auth-form-panel">
        <form onSubmit={handleSubmit} className="form-container" noValidate>
          <span className="mobile-logo">CareerMate</span>
          <div className="form-heading"><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p>It only takes a minute.</p></div>
          <TextInput label="Full name" name="name" autoComplete="name" autoFocus {...nameField} />
          <TextInput label="Email address" name="email" type="email" autoComplete="email" {...emailField} />
          <TextInput label="Password" name="password" type="password" autoComplete="new-password" hint="Use 6–20 characters." {...passwordField} />
          <TextInput label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" {...confirmPasswordField} />

          {(validationError || apiError) && !registered && <p className="form-error" role="alert">{validationError || apiError}</p>}
          {registered && <p className="success-message" role="status">Account created. Taking you to sign in…</p>}
          <button className="primary-button submit-button" disabled={status === "loading" || registered}>{status === "loading" ? "Creating account…" : "Create account"}</button>
          <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  );
}
