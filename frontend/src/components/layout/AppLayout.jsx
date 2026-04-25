import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {cn} from "../../lib/cn";
import {useAuth} from "../../context/AuthContext";
import {
  BellIcon,
  CalendarIcon,
  HeartIcon,
  ShieldIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "../icons";

const navigation = [
  {to: "/dashboard", label: "Dashboard", icon: SparklesIcon},
  {to: "/adoption", label: "Online Adoption", icon: HeartIcon},
  {to: "/register-pet", label: "Register Pet", icon: ShieldIcon},
  {to: "/matching", label: "Pet Matching", icon: SparklesIcon},
  {to: "/appointments", label: "Appointments", icon: CalendarIcon},
  {to: "/my-pets", label: "My Pets", icon: StethoscopeIcon},
  {to: "/notifications", label: "Reminders", icon: BellIcon},
  {to: "/adoption-status", label: "Screening", icon: ShieldIcon},
];

export default function AppLayout() {
  const navigate = useNavigate();
  const {currentUser, logout, isAuthenticated} = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eefaf4_100%)] text-slate-900">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/15">
                <HeartIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  Animal Care Management
                </p>
                <p className="truncate text-sm text-slate-500">User portal</p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <Badge variant="primary" className="inline-flex max-w-[12rem] truncate">
                {isAuthenticated
                  ? `${currentUser?.name}${currentUser?.role === "admin" ? " · Admin" : currentUser?.role === "pet_owner" ? " · Pet owner" : " · Adopter"}`
                  : "Guest"}
              </Badge>
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 bg-white"
                  onClick={() => {
                    logout();
                    navigate("/website");
                  }}
                >
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
        </header>

        <main className="flex-1 px-4 py-5 md:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({isActive}) =>
                    cn(
                      "group flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2.5 transition",
                      isActive
                        ? "border-emerald-500 bg-white text-emerald-700 shadow-sm"
                        : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-200 hover:text-slate-900",
                    )
                  }
                >
                  {({isActive}) => (
                    <>
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition",
                          isActive
                            ? "border-emerald-500 bg-emerald-600 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-600 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 break-words text-left text-sm font-semibold leading-tight">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
