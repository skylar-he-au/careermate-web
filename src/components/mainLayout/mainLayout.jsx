import { useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import "./mainLayout.css";

export default function MainLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: "🏠",
      path: "/home",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },
    {
      name: "Jobs",
      icon: "💼",
      path: "/jobs",
    },
    {
      name: "Applications",
      icon: "📄",
      path: "/applications",
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/home")}
        >
          <span className="logo-icon">💼</span>
          <span>CareerMate</span>
        </div>

        <div className="user-menu">
          <button
            className="avatar"
            onClick={() =>
              setOpen((previous) => !previous)
            }
          >
            {(user?.email ?? "U")
              .charAt(0)
              .toUpperCase()}
          </button>

          {open && (
            <div className="dropdown">
              <div className="dropdown-header">
                <strong>
                  Hello,{" "}
                  {user?.name ??
                    user?.email ??
                    "User"}
                  !
                </strong>

                {user?.email && (
                  <span>{user.email}</span>
                )}
              </div>

              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="layout-body">
        <aside className="sidebar">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {(user?.name ??
                user?.email ??
                "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="sidebar-user-details">
              <strong>
                {user?.name ?? "User"}
              </strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="sidebar-menu">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  className={
                    isActive
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() =>
                    navigate(item.path)
                  }
                >
                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  <span className="sidebar-label">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}