import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {useAuth} from "../context/AuthContext";
import {HeartIcon, ShieldIcon, SparklesIcon} from "../components/icons";

const loginInitial = {
  email: "",
  password: "",
};

const registerInitial = {
  name: "",
  email: "",
  password: "",
  role: "adopter",
};

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const {login, register, currentUser, isAuthLoading} = useAuth();

  const getRedirectPath = (role) =>
    role === "admin" ? "/admin" : "/dashboard";

  useEffect(() => {
    if (!isAuthLoading && currentUser) {
      navigate(getRedirectPath(currentUser.role), {replace: true});
    }
  }, [currentUser, navigate, isAuthLoading]);

  function switchMode(nextMode) {
    setError("");
    setSuccess("");
    setSearchParams({mode: nextMode});
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = await login(loginForm.email, loginForm.password);
      navigate(getRedirectPath(user.role), {replace: true});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
      });
      setSuccess("Account created successfully. Redirecting to the dashboard.");
      navigate(getRedirectPath(user.role), {replace: true});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
        {/* ── Left — Branding panel ── */}
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <HeartIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              PawCare
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {mode === "login" ? "Welcome back." : "Create your account."}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-500">
              Access pet registration, appointments, and personal pet records —
              all from one place.
            </p>
          </div>

          {/* Feature tiles */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
                <ShieldIcon className="h-4 w-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Secure authentication
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Protected backend login with validated passwords.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
                <SparklesIcon className="h-4 w-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Full portal access
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Pet registration, records, and appointments in one dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link
            to="/website"
            className="text-sm font-medium text-zinc-400 underline-offset-4 transition hover:text-zinc-700 hover:underline"
          >
            ← Back to landing page
          </Link>
        </div>

        {/* ── Right — Auth form ── */}
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-900/5">
          {/* Mode toggle */}
          <div className="mb-7 flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  mode === m
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Login form */}
          {mode === "login" ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="login-email"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm({...loginForm, email: event.target.value})
                  }
                  placeholder="you@example.com"
                  required
                  className="rounded-xl border-zinc-200 px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="login-password"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm({...loginForm, password: event.target.value})
                  }
                  placeholder="••••••••"
                  required
                  className="rounded-xl border-zinc-200 px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>

              <Button
                type="submit"
                className="mt-1 w-full rounded-xl py-3 text-sm font-medium transition hover:-translate-y-0.5"
              >
                Sign in
              </Button>

              <p className="text-center text-sm text-zinc-400">
                No account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-medium text-zinc-700 underline-offset-4 hover:underline"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="register-name"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Full name
                </Label>
                <Input
                  id="register-name"
                  value={registerForm.name}
                  onChange={(event) =>
                    setRegisterForm({...registerForm, name: event.target.value})
                  }
                  placeholder="Jane Tan"
                  required
                  className="rounded-xl border-zinc-200 px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="register-email"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="jane@example.com"
                  required
                  className="rounded-xl border-zinc-200 px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="register-password"
                  className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
                >
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      password: event.target.value,
                    })
                  }
                  placeholder="Create a password"
                  required
                  className="rounded-xl border-zinc-200 px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-0 transition"
                />
                <p className="text-xs text-zinc-400">
                  At least 8 characters with a letter, number, and special
                  character.
                </p>
              </div>

              <Button
                type="submit"
                className="mt-1 w-full rounded-xl py-3 text-sm font-medium transition hover:-translate-y-0.5"
              >
                Create account
              </Button>

              <p className="text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-medium text-zinc-700 underline-offset-4 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
