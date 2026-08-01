import { createContext, useContext, useMemo, useState } from "react";

const SESSION_KEY = "careermate.session";
const USERS_KEY = "careermate.users";

const demoUser = {
  id: "demo-user",
  name: "Demo User",
  email: "test@test.com",
  title: "Job seeker",
  location: "Sydney, Australia",
  bio: "Building the next chapter of my career.",
};

const AuthContext = createContext(null);

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null));

  function persistSession(nextUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function login(email, password) {
    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail === demoUser.email && password === "123456") {
      persistSession(demoUser);
      return demoUser;
    }

    const users = readJson(USERS_KEY, []);
    const account = users.find(
      (candidate) =>
        candidate.email === normalizedEmail && candidate.password === password
    );

    if (!account) {
      throw new Error("Incorrect email or password");
    }

    const { password: _password, ...safeUser } = account;
    persistSession(safeUser);
    return safeUser;
  }

  function register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const users = readJson(USERS_KEY, []);

    if (
      normalizedEmail === demoUser.email ||
      users.some((candidate) => candidate.email === normalizedEmail)
    ) {
      throw new Error("An account with this email already exists");
    }

    const account = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      title: "Job seeker",
      location: "",
      bio: "",
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, account]));
    return account;
  }

  function updateProfile(profile) {
    if (!user) return;

    const nextUser = {
      ...user,
      name: profile.name.trim(),
      title: profile.title.trim(),
      location: profile.location.trim(),
      bio: profile.bio.trim(),
    };

    const users = readJson(USERS_KEY, []);
    const nextUsers = users.map((account) =>
      account.id === nextUser.id ? { ...account, ...nextUser } : account
    );

    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    persistSession(nextUser);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      updateProfile,
      logout,
    }),
    // The functions deliberately close over the latest user value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthContext;
