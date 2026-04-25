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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eefaf4_100%)] px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden border-white/70 bg-white/85 shadow-xl shadow-emerald-950/5 backdrop-blur">
          <CardHeader className="space-y-5">
            <Badge variant="soft" className="w-fit">
              Welcome to PawCare
            </Badge>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/15">
                <HeartIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Animal Care Management System
                </p>
                <CardTitle className="mt-1 text-3xl sm:text-4xl">
                  Sign in to PawCare
                </CardTitle>
              </div>
            </div>
            <CardDescription className="max-w-xl text-base leading-7 text-slate-600">
              Access the user portal for pet registration, appointments, and
              personal pet records from one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <ShieldIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Secure authentication
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Protected backend login with validated passwords.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                    <SparklesIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      User portal access
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Continue into pet registration, my pets, and appointments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  mode === "login"
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-950">Login</p>
                <p className="mt-1 text-sm text-slate-600">
                  Sign in with your existing account.
                </p>
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  mode === "register"
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-950">Register</p>
                <p className="mt-1 text-sm text-slate-600">
                  Create a new secure user profile.
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/92 shadow-xl shadow-emerald-950/5 backdrop-blur">
          <CardHeader>
            <CardTitle>
              {mode === "login" ? "Login" : "Create account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to continue to the dashboard."
                : "Register a new account for the PawCare user portal."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            {mode === "login" ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm({...loginForm, email: event.target.value})
                    }
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm({...loginForm, password: event.target.value})
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full name</Label>
                  <Input
                    id="register-name"
                    value={registerForm.name}
                    onChange={(event) =>
                      setRegisterForm({
                        ...registerForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Jane Tan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
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
                  />
                  <p className="text-xs text-slate-500">
                    Use at least 8 characters with a letter, a number, and a
                    special character.
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </form>
            )}

            <div className="mt-4 text-sm text-slate-600">
              <Link
                to="/website"
                className="font-medium text-emerald-700 hover:text-emerald-600"
              >
                Back to landing page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
