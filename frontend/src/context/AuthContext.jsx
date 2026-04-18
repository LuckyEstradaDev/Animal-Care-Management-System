/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultUsers } from "../data/auth";

const USERS_KEY = "acm_users";
const SESSION_KEY = "acm_session";

const AuthContext = createContext(null);

function normalizeUser(user) {
  return {
    ...user,
    role: user.role ?? "adopter",
  };
}

function readStoredUsers() {
  if (typeof window === "undefined") return defaultUsers.map(normalizeUser);

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw).map(normalizeUser) : defaultUsers.map(normalizeUser);
  } catch {
    return defaultUsers.map(normalizeUser);
  }
}

function readStoredSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readStoredUsers);
  const [currentUser, setCurrentUser] = useState(readStoredSession);

  useEffect(() => {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const login = useCallback(
    (email, password) => {
      const user = users.find(
        (entry) =>
          entry.email.toLowerCase() === email.toLowerCase() &&
          entry.password === password,
      );

      if (!user) {
        throw new Error("Invalid email or password.");
      }

      setCurrentUser({
        name: user.name,
        email: user.email,
        role: user.role ?? "adopter",
      });
      return user;
    },
    [users],
  );

  const register = useCallback(
    ({ name, email, password, role = "adopter" }) => {
      const exists = users.some(
        (entry) => entry.email.toLowerCase() === email.toLowerCase(),
      );

      if (exists) {
        throw new Error("This email is already registered.");
      }

      const nextUser = { name, email, password, role };
      setUsers((current) => [...current, nextUser]);
      setCurrentUser({ name, email, role });
      return nextUser;
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      login,
      register,
      logout,
      isAuthenticated: Boolean(currentUser),
    }),
    [users, currentUser, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
