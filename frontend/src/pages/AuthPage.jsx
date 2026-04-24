import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {useAuth} from "../context/AuthContext";

const loginInitial = {
  email: "demo@animalcare.test",
  password: "demo123",
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
  const {login, register, currentUser} = useAuth();

  const getRedirectPath = (role) => (role === "admin" ? "/admin" : "/dashboard");

  useEffect(() => {
    if (currentUser) {
      navigate(getRedirectPath(currentUser.role), {replace: true});
    }
  }, [currentUser, navigate]);

  function switchMode(nextMode) {
    setError("");
    setSuccess("");
    setSearchParams({mode: nextMode});
  }

  function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = login(loginForm.email, loginForm.password);
      navigate(getRedirectPath(user.role), {replace: true});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  function handleRegister(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = register({
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eefaf4_100%)] px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge variant="soft" className="w-fit">
              Animal Care Auth
            </Badge>
            <CardTitle className="text-2xl sm:text-3xl">
              Simple login and registration prototype
            </CardTitle>
            <CardDescription>
              Use the demo account or create a new static user. This is front-end only for now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">Demo credentials</p>
              <p className="mt-1 break-words text-sm text-slate-600">
                User: demo@animalcare.test / demo123
              </p>
              <p className="break-words text-sm text-slate-600">
                Admin: admin@animalcare.test / admin123
              </p>
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
                <p className="mt-1 text-sm text-slate-600">Sign in with your existing account.</p>
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
                <p className="mt-1 text-sm text-slate-600">Create a new static user profile.</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{mode === "login" ? "Login" : "Create account"}</CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to continue to the dashboard."
                : "Register a new account for this prototype."}
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
                    onChange={(event) => setLoginForm({...loginForm, email: event.target.value})}
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
                    onChange={(event) => setLoginForm({...loginForm, password: event.target.value})}
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
                    onChange={(event) => setRegisterForm({...registerForm, name: event.target.value})}
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
                    onChange={(event) => setRegisterForm({...registerForm, email: event.target.value})}
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
                    onChange={(event) => setRegisterForm({...registerForm, password: event.target.value})}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Account type</Label>
                  <select
                    id="register-role"
                    value={registerForm.role}
                    onChange={(event) => setRegisterForm({...registerForm, role: event.target.value})}
                    className="flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="adopter">Adopter</option>
                    <option value="pet_owner">Pet owner</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </form>
            )}

            <div className="mt-4 text-sm text-slate-600">
              <Link to="/website" className="font-medium text-emerald-700 hover:text-emerald-600">
                Back to landing page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
