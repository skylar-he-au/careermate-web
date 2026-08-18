import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getResumeDownload } from "../../services/resumeApi";
import { fetchResumes, setPage, setPageSize } from "../../store/resumeSlice";
import "./resumes.css";

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 1) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((first, second) => first - second);

  return pages.flatMap((pageNumber, index) => {
    const previous = pages[index - 1];
    return previous && pageNumber - previous > 1
      ? [`ellipsis-${previous}`, pageNumber]
      : [pageNumber];
  });
}

export default function Resumes() {
  const dispatch = useDispatch();
  const { items, pagination, status, error } = useSelector((state) => state.resumes);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const { page, pageSize, totalItems, totalPages } = pagination;
  const pageItems = getPageItems(page, totalPages);

  useEffect(() => {
    dispatch(fetchResumes({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  async function handleDownload(resume) {
    try {
      setDownloadingId(resume._id ?? resume.id);
      setDownloadError("");
      const download = await getResumeDownload(resume._id ?? resume.id);
      if (!download?.downloadUrl) throw new Error("The server did not return a download link");

      const link = document.createElement("a");
      link.href = download.downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = download.fileName || resume.fileName;
      link.click();
    } catch (requestError) {
      setDownloadError(requestError.message);
    } finally {
      setDownloadingId(null);
    }
  }

  function retry() {
    dispatch(fetchResumes({ page, pageSize }));
  }

  return (
    <div className="page resumes-page">
      <header className="page-header resumes-header">
        <div>
          <span className="eyebrow">YOUR FILES</span>
          <h1>My resumes</h1>
          <p>Only resumes belonging to your signed-in account are shown.</p>
        </div>
        <label className="page-size-control">
          <span>Rows per page</span>
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => dispatch(setPageSize(Number(event.target.value)))}
          >
            {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </header>

      {downloadError && <div className="form-error resumes-error" role="alert">{downloadError}</div>}

      {status === "loading" && items.length === 0 ? (
        <div className="panel resume-loading" role="status">Loading your resumes…</div>
      ) : status === "failed" ? (
        <div className="empty-state">
          <span>!</span>
          <h2>We could not load your resumes</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={retry}>Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <span>▧</span>
          <h2>No resumes yet</h2>
          <p>Uploaded resumes will appear here.</p>
        </div>
      ) : (
        <section className="panel resume-panel" aria-label="Resume list" aria-busy={status === "loading"}>
          <div className="resume-list">
            {items.map((resume) => {
              const resumeId = resume._id ?? resume.id;
              return (
                <article className="resume-row" key={resumeId}>
                  <span className="resume-file-icon" aria-hidden="true">PDF</span>
                  <div className="resume-details">
                    <strong>{resume.fileName} {resume.isSample && <small>Sample</small>}</strong>
                    <span>{formatFileSize(resume.fileSize)} · Uploaded {formatDate(resume.createdAt)}</span>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => handleDownload(resume)}
                    disabled={resume.isSample || downloadingId === resumeId}
                    title={resume.isSample ? "Sample data is for pagination preview only" : undefined}
                  >
                    {resume.isSample ? "Sample" : downloadingId === resumeId ? "Preparing…" : "Download"}
                  </button>
                </article>
              );
            })}
          </div>

          <footer className="pagination" aria-label="Resume pagination">
            <span>{totalItems} {totalItems === 1 ? "resume" : "resumes"}</span>
            <div>
              <button className="secondary-button" disabled={page <= 1 || status === "loading"} onClick={() => dispatch(setPage(page - 1))}>Previous</button>
              <div className="page-numbers">
                {pageItems.map((pageItem) =>
                  typeof pageItem === "number" ? (
                    <button
                      key={pageItem}
                      className={`page-number${pageItem === page ? " active" : ""}`}
                      aria-label={`Page ${pageItem}`}
                      aria-current={pageItem === page ? "page" : undefined}
                      disabled={status === "loading"}
                      onClick={() => dispatch(setPage(pageItem))}
                    >
                      {pageItem}
                    </button>
                  ) : (
                    <span className="page-ellipsis" key={pageItem} aria-hidden="true">…</span>
                  )
                )}
              </div>
              <button className="secondary-button" disabled={page >= totalPages || status === "loading"} onClick={() => dispatch(setPage(page + 1))}>Next</button>
            </div>
          </footer>
        </section>
      )}
    </div>
  );
}
