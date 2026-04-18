import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  BellIcon,
  CalendarIcon,
  HeartIcon,
  ShieldIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "../icons";
import { cn } from "../../lib/cn";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: SparklesIcon },
  { to: "/adoption", label: "Online Adoption", icon: HeartIcon },
  { to: "/matching", label: "AI Matching", icon: SparklesIcon },
  { to: "/appointments", label: "Appointments", icon: CalendarIcon },
  { to: "/my-pets", label: "My Pets", icon: StethoscopeIcon },
  { to: "/notifications", label: "Reminders", icon: BellIcon },
  { to: "/adoption-status", label: "Screening", icon: ShieldIcon },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eefaf4_100%)] text-slate-900">
      <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col border-r border-white/60 bg-slate-950/92 px-4 py-5 text-slate-100 backdrop-blur">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <HeartIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">PawCare</p>
                <p className="text-xs text-slate-300">User experience</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Adoption, matching, appointments, and care.
            </p>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-400 text-slate-950"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-200">Quick action</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Jump straight to the adoption flow.
            </p>
            <Button className="mt-3 w-full bg-white text-slate-950 hover:bg-slate-100" onClick={() => navigate("/adoption")}>
              Start Adoption
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 px-4 py-3 backdrop-blur md:px-6">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/15 lg:hidden">
                  <HeartIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Animal Care Management</p>
                  <p className="text-sm text-slate-500">User portal</p>
                </div>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <Badge variant="primary" className="inline-flex">
                  {isAuthenticated ? currentUser?.name : "Guest"}
                </Badge>
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" className="border-slate-200 bg-white" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 bg-white"
                    onClick={() => navigate("/auth?mode=login")}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navigation.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition",
                      isActive ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-6">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
