import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jobs } from "../../data/jobs";
import "./home.css";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const applications = useSelector((state) => state.career.applications);
  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length;
  const offerCount = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  return (
    <div className="page dashboard-page">
      <section className="welcome-card">
        <div>
          <span className="eyebrow">YOUR CAREER WORKSPACE</span>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "there"}.</h1>
          <p>Keep your search focused and move every opportunity forward.</p>
        </div>
        <Link className="primary-button" to="/jobs">
          Browse jobs
        </Link>
      </section>

      <section className="stats-grid" aria-label="Career statistics">
        <article className="stat-card">
          <span className="stat-icon blue">◎</span>
          <div><strong>{jobs.length}</strong><span>Open jobs</span></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon purple">↗</span>
          <div><strong>{applications.length}</strong><span>Applications</span></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon orange">◇</span>
          <div><strong>{interviewCount}</strong><span>Interviews</span></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">✓</span>
          <div><strong>{offerCount}</strong><span>Offers</span></div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div><span className="eyebrow">RECENT ACTIVITY</span><h2>Your applications</h2></div>
            <Link to="/applications">View all</Link>
          </div>
          {applications.length === 0 ? (
            <div className="empty-state compact">
              <span>📋</span>
              <h3>No applications yet</h3>
              <p>Add a role from the jobs page to start tracking your progress.</p>
            </div>
          ) : (
            <div className="activity-list">
              {applications.slice(0, 4).map((application) => (
                <div className="activity-row" key={application.id}>
                  <div className="company-mark">{application.company.charAt(0)}</div>
                  <div><strong>{application.jobTitle}</strong><span>{application.company}</span></div>
                  <span className={`status-badge ${application.status.toLowerCase()}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel next-steps">
          <span className="eyebrow">NEXT STEPS</span>
          <h2>Build momentum</h2>
          <Link to="/resumes"><span>1</span><div><strong>Review your resumes</strong><small>View and download your uploaded files</small></div>→</Link>
          <Link to="/jobs"><span>2</span><div><strong>Find a role</strong><small>Search curated opportunities</small></div>→</Link>
          <Link to="/applications"><span>3</span><div><strong>Update your tracker</strong><small>Record interviews and offers</small></div>→</Link>
        </article>
      </section>
    </div>
  );
}

export default Home;
