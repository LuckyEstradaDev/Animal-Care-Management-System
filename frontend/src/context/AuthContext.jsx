/* eslint-disable react-refresh/only-export-components */
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

const SESSION_KEY = "acm_session";
const API_BASE_URL = "http://localhost:5000/api/auth";
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name:
      user.name ??
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
    email: user.email,
    role: user.role,
  };
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

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must be at least 8 characters and include a letter, a number, and a special character.",
    );
  }
}

export function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState(readStoredSession);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          setCurrentUser(null);
          window.localStorage.removeItem(SESSION_KEY);
          return;
        }

        const data = await response.json();
        const user = normalizeUser(data.user);
        setCurrentUser(user);
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch {
        setCurrentUser(readStoredSession());
      } finally {
        setIsAuthLoading(false);
      }
    }

    hydrateSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const login = useCallback(async (email, password) => {
    const data = await handleResponse(
      await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          rawPassword: password,
        }),
      }),
    );

    const user = normalizeUser(data.user);
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(async ({name, email, password, role = "adopter"}) => {
    validatePassword(password);

    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ") || "User";

    const data = await handleResponse(
      await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          rawPassword: password,
          role,
        }),
      }),
    );

    const user = normalizeUser(data.user);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/sign-out`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setCurrentUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      login,
      register,
      logout,
      isAuthenticated: Boolean(currentUser),
      isAuthLoading,
    }),
    [currentUser, login, register, logout, isAuthLoading],
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
