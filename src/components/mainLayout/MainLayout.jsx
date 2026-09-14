import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/authSlice";
import { resetResumes } from "../../store/resumeSlice";
import "./MainLayout.css";

const menuItems = [
  { name: "Dashboard", icon: "⌂", path: "/home" },
  { name: "Jobs", icon: "⌕", path: "/jobs" },
  { name: "Applications", icon: "▤", path: "/applications" },
  { name: "My resumes", icon: "▧", path: "/resumes" },
];

export default function MainLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!menuRef.current?.contains(event.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleLogout() {
    dispatch(resetResumes());
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  }

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="app-layout">
      <header className="navbar">
        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileMenuOpen}>☰</button>
        <button className="logo" onClick={() => navigate("/home")}><span>CM</span><strong>CareerMate</strong></button>
        <div className="user-menu" ref={menuRef}>
          <button className="user-trigger" onClick={() => setUserMenuOpen((open) => !open)} aria-expanded={userMenuOpen}><span className="avatar">{initial}</span><span className="user-trigger-text"><strong>{user?.name || "User"}</strong><small>{user?.email}</small></span><span>⌄</span></button>
          {userMenuOpen && <div className="dropdown"><NavLink to="/resumes" onClick={() => setUserMenuOpen(false)}>My resumes</NavLink><button onClick={handleLogout}>Sign out</button></div>}
        </div>
      </header>

      <div className="layout-body">
        <aside className={`sidebar${mobileMenuOpen ? " open" : ""}`}>
          <nav className="sidebar-menu" aria-label="Main navigation">
            {menuItems.map((item) => <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}><span className="sidebar-icon">{item.icon}</span><span>{item.name}</span></NavLink>)}
          </nav>
          <div className="sidebar-tip"><span>✦</span><strong>Career tip</strong><p>Tailor your application to each role instead of sending the same one everywhere.</p></div>
        </aside>
        {mobileMenuOpen && <button className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" />}
        <main className="layout-content"><Outlet /></main>
      </div>
    </div>
  );
}
