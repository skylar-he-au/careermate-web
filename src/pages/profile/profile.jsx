import { useMemo, useState } from "react";
import KeywordSearch from "../../components/keywordSearch/KeywordSearch";
import MessageModal from "../../components/popups/MessageModal";
import Modal from "../../components/popups/Modal";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validateName } from "../../utils/validators";
import "./profile.css";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  jobTitle: "",
  location: "",
  summary: "",
};

const initialProfiles = [
  {
    id: "profile-lily",
    name: "Lily Jiang",
    email: "lily@test.com",
    phone: "0400 123 456",
    jobTitle: "Senior Developer",
    location: "Brisbane, Australia",
    summary: "Experienced software developer focused on reliable web platforms.",
  },
  {
    id: "profile-john",
    name: "John Smith",
    email: "john@test.com",
    phone: "0400 222 333",
    jobTitle: "Frontend Developer",
    location: "Sydney, Australia",
    summary: "Frontend developer specialising in React and accessible interfaces.",
  },
  {
    id: "profile-sarah",
    name: "Sarah Lee",
    email: "sarah@test.com",
    phone: "0400 555 666",
    jobTitle: "Business Analyst",
    location: "Melbourne, Australia",
    summary: "Business analyst with five years of delivery and stakeholder experience.",
  },
];

function getStorageKey(userId) {
  return `careermate.profiles.${userId}`;
}

function readProfiles(userId) {
  if (!userId) return initialProfiles;

  try {
    const saved = localStorage.getItem(getStorageKey(userId));
    return saved ? JSON.parse(saved) : initialProfiles;
  } catch {
    localStorage.removeItem(getStorageKey(userId));
    return initialProfiles;
  }
}

export default function Profile() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState(() => readProfiles(user?.id));
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [formError, setFormError] = useState("");
  const [messageModal, setMessageModal] = useState({ open: false, title: "", message: "" });

  const filteredProfiles = useMemo(() => {
    const normalizedKeyword = searchKeyword.toLowerCase();
    if (!normalizedKeyword) return profiles;

    return profiles.filter((profile) =>
      [profile.name, profile.email, profile.phone, profile.jobTitle, profile.location, profile.summary]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [profiles, searchKeyword]);

  function persistProfiles(nextProfiles) {
    setProfiles(nextProfiles);
    if (user?.id) {
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(nextProfiles));
    }
  }

  function openAddModal() {
    setProfileForm(emptyProfile);
    setFormError("");
    setShowAddModal(true);
  }

  function closeAddModal() {
    setShowAddModal(false);
    setProfileForm(emptyProfile);
    setFormError("");
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
    setFormError("");
  }

  function handleSaveProfile(event) {
    event.preventDefault();
    const validationError = validateName(profileForm.name) || validateEmail(profileForm.email);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (profiles.some((profile) => profile.email.toLowerCase() === profileForm.email.trim().toLowerCase())) {
      setFormError("A profile with this email already exists");
      return;
    }

    const newProfile = {
      ...profileForm,
      id: `profile-${Date.now()}`,
      name: profileForm.name.trim(),
      email: profileForm.email.trim().toLowerCase(),
      phone: profileForm.phone.trim(),
      jobTitle: profileForm.jobTitle.trim(),
      location: profileForm.location.trim(),
      summary: profileForm.summary.trim(),
    };

    persistProfiles([newProfile, ...profiles]);
    closeAddModal();
    setMessageModal({
      open: true,
      title: "Profile added",
      message: `${newProfile.name} has been added to your career profiles.`,
    });
  }

  return (
    <div className="page profiles-page">
      <header className="page-header profiles-header">
        <div>
          <span className="eyebrow">CAREER DIRECTORY</span>
          <h1>Profiles</h1>
          <p>Search, view and manage career profiles.</p>
        </div>
        <button className="primary-button" onClick={openAddModal}>+ Add profile</button>
      </header>

      <section className="profile-search panel" aria-label="Profile search">
        <KeywordSearch
          value={keyword}
          onChange={setKeyword}
          onSearch={setSearchKeyword}
          debounceDelay={400}
          label="Find a profile"
          placeholder="Search by name, email, title or location"
        />
      </section>

      <div className="profile-result-summary" role="status">
        <strong>{filteredProfiles.length}</strong> profile{filteredProfiles.length === 1 ? "" : "s"} found
        {searchKeyword && <span> for “{searchKeyword}”</span>}
      </div>

      <section className="profile-table-card panel" aria-label="Career profiles">
        <div className="profile-table-scroll">
          <table className="profile-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job title</th>
                <th>Location</th>
                <th>Phone</th>
                <th><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id}>
                  <td>
                    <div className="profile-name-cell">
                      <span className="profile-list-avatar" aria-hidden="true">{profile.name.charAt(0).toUpperCase()}</span>
                      <strong>{profile.name}</strong>
                    </div>
                  </td>
                  <td>{profile.email}</td>
                  <td>{profile.jobTitle || "—"}</td>
                  <td>{profile.location || "—"}</td>
                  <td>{profile.phone || "—"}</td>
                  <td><button className="profile-view-button" onClick={() => setSelectedProfile(profile)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProfiles.length === 0 && (
          <div className="profile-empty-state">
            <span>🔎</span>
            <h2>No profiles found</h2>
            <p>Try a different name, email, job title or location.</p>
            <button className="secondary-button" onClick={() => setKeyword("")}>Clear search</button>
          </div>
        )}
      </section>

      <Modal
        open={showAddModal}
        title="Add profile"
        description="Enter the personal and career information."
        onClose={closeAddModal}
        footer={
          <>
            <button type="button" className="secondary-button" onClick={closeAddModal}>Cancel</button>
            <button type="submit" form="add-profile-form" className="primary-button">Save profile</button>
          </>
        }
      >
        <form id="add-profile-form" className="profile-modal-form" onSubmit={handleSaveProfile} noValidate>
          <label><span>Full name *</span><input name="name" value={profileForm.name} onChange={handleProfileChange} autoComplete="name" /></label>
          <label><span>Email *</span><input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} autoComplete="email" /></label>
          <label><span>Phone</span><input name="phone" value={profileForm.phone} onChange={handleProfileChange} autoComplete="tel" /></label>
          <label><span>Job title</span><input name="jobTitle" value={profileForm.jobTitle} onChange={handleProfileChange} /></label>
          <label className="full-width"><span>Location</span><input name="location" value={profileForm.location} onChange={handleProfileChange} autoComplete="address-level2" /></label>
          <label className="full-width"><span>Career summary</span><textarea name="summary" rows="5" maxLength="400" value={profileForm.summary} onChange={handleProfileChange} /></label>
          {formError && <p className="form-error full-width" role="alert">{formError}</p>}
        </form>
      </Modal>

      <Modal
        open={Boolean(selectedProfile)}
        title={selectedProfile?.name || "Profile details"}
        description={selectedProfile?.jobTitle || "Career profile"}
        size="small"
        onClose={() => setSelectedProfile(null)}
        footer={<button className="primary-button" onClick={() => setSelectedProfile(null)}>Done</button>}
      >
        {selectedProfile && (
          <div className="profile-details">
            <div className="profile-detail-avatar">{selectedProfile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
            <dl>
              <div><dt>Email</dt><dd>{selectedProfile.email}</dd></div>
              <div><dt>Phone</dt><dd>{selectedProfile.phone || "Not provided"}</dd></div>
              <div><dt>Location</dt><dd>{selectedProfile.location || "Not provided"}</dd></div>
              <div className="full-width"><dt>Career summary</dt><dd>{selectedProfile.summary || "No summary provided."}</dd></div>
            </dl>
          </div>
        )}
      </Modal>

      <MessageModal
        open={messageModal.open}
        type="success"
        title={messageModal.title}
        message={messageModal.message}
        onClose={() => setMessageModal((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}
