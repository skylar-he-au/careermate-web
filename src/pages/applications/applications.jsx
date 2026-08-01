import { Link } from "react-router-dom";
import { useCareer } from "../../contexts/CareerContext";
import "./applications.css";

const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export default function Applications() {
  const { applications, updateApplicationStatus, removeApplication } = useCareer();

  return (
    <div className="page applications-page">
      <header className="page-header">
        <div><span className="eyebrow">PIPELINE</span><h1>Application tracker</h1><p>Keep every role, conversation and outcome in one place.</p></div>
      </header>

      {applications.length === 0 ? (
        <div className="empty-state panel"><span>📭</span><h2>Your tracker is empty</h2><p>Browse jobs and add your first opportunity to begin.</p><Link className="primary-button" to="/jobs">Browse jobs</Link></div>
      ) : (
        <section className="application-list" aria-label="Applications">
          {applications.map((application) => (
            <article className="application-card" key={application.id}>
              <div className="company-mark large">{application.company.charAt(0)}</div>
              <div className="application-main"><h2>{application.jobTitle}</h2><p>{application.company} · {application.location}</p><small>Added {new Date(application.appliedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</small></div>
              <label className="status-control"><span>Status</span><select value={application.status} onChange={(event) => updateApplicationStatus(application.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <button className="icon-button danger" onClick={() => removeApplication(application.id)} aria-label={`Remove ${application.jobTitle}`}>×</button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
