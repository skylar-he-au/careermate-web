import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validateName } from "../../utils/validators";
import "./profile.css";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", title: "", location: "", bio: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name ?? "", email: user.email ?? "", title: user.title ?? "", location: user.location ?? "", bio: user.bio ?? "" });
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage(""); setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateName(form.name) || validateEmail(form.email);
    if (validationError) { setError(validationError); return; }
    updateProfile(form);
    setMessage("Your profile has been saved.");
  }

  const initials = form.name.split(" ").filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "CM";

  return (
    <div className="page profile-page">
      <header className="page-header"><div><span className="eyebrow">PERSONAL DETAILS</span><h1>Your profile</h1><p>Keep your career goals and contact details up to date.</p></div></header>
      <div className="profile-layout">
        <aside className="profile-summary panel">
          <div className="profile-avatar">{initials}</div><h2>{form.name || "Your name"}</h2><p>{form.title || "Job seeker"}</p>
          <div className="profile-summary-details"><span><small>EMAIL</small>{form.email}</span><span><small>LOCATION</small>{form.location || "Not provided"}</span></div>
        </aside>

        <form className="profile-form panel" onSubmit={handleSubmit} noValidate>
          <div className="panel-heading"><div><h2>Profile information</h2><p>This information is only stored in this browser.</p></div></div>
          <div className="profile-fields">
            <label><span>Full name</span><input name="name" value={form.name} onChange={handleChange} autoComplete="name" /></label>
            <label><span>Email address</span><input name="email" value={form.email} readOnly disabled /><small>Email cannot be changed in this demo.</small></label>
            <label><span>Current title or goal</span><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" /></label>
            <label><span>Location</span><input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Sydney, Australia" autoComplete="address-level2" /></label>
            <label className="full-width"><span>Short bio</span><textarea name="bio" value={form.bio} onChange={handleChange} maxLength="240" rows="5" placeholder="Describe what you are looking for and what you bring." /><small>{form.bio.length}/240 characters</small></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="success-message" role="status">{message}</p>}
          <div className="profile-actions"><button className="primary-button">Save changes</button></div>
        </form>
      </div>
    </div>
  );
}
