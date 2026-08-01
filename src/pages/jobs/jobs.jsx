import { useMemo, useState } from "react";
import { useCareer } from "../../contexts/CareerContext";
import "./jobs.css";

export default function Jobs() {
  const { jobs, applications, applyToJob } = useCareer();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("All");
  const [notice, setNotice] = useState("");

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery = [job.title, job.company, job.location, ...job.skills]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesQuery && (mode === "All" || job.mode === mode);
    });
  }, [jobs, mode, query]);

  function handleApply(jobId) {
    try {
      const application = applyToJob(jobId);
      setNotice(`${application.jobTitle} was added to your tracker.`);
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <div className="page jobs-page">
      <header className="page-header">
        <div><span className="eyebrow">OPPORTUNITIES</span><h1>Find your next role</h1><p>Search roles and save promising opportunities to your tracker.</p></div>
      </header>

      <section className="job-filters" aria-label="Job filters">
        <label className="search-field">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, company, skill or location" />
        </label>
        <label>
          <span className="sr-only">Work mode</span>
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option>All</option><option>Remote</option><option>Hybrid</option><option>On-site</option>
          </select>
        </label>
      </section>

      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}

      <div className="results-heading"><strong>{filteredJobs.length} roles</strong><span>Curated demo opportunities</span></div>
      {filteredJobs.length === 0 ? (
        <div className="empty-state"><span>🔎</span><h2>No matching jobs</h2><p>Try a broader search or a different work mode.</p></div>
      ) : (
        <section className="job-grid">
          {filteredJobs.map((job) => {
            const applied = applications.some((application) => application.jobId === job.id);
            return (
              <article className="job-card" key={job.id}>
                <div className="job-card-top"><div className="company-mark large">{job.company.charAt(0)}</div><span>{job.posted}</span></div>
                <h2>{job.title}</h2><p className="company-name">{job.company}</p>
                <div className="job-meta"><span>⌖ {job.location}</span><span>◷ {job.type}</span><span>◉ {job.mode}</span></div>
                <p className="job-description">{job.description}</p>
                <div className="skill-list">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                <div className="job-card-footer"><strong>{job.salary}</strong><button className={applied ? "secondary-button" : "primary-button"} disabled={applied} onClick={() => handleApply(job.id)}>{applied ? "In tracker" : "Add to tracker"}</button></div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
