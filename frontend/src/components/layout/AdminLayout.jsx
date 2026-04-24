import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {HeartIcon, ShieldIcon, SparklesIcon} from "../icons";
import {cn} from "../../lib/cn";
import {useAuth} from "../../context/AuthContext";

const navigation = [
  {to: "/admin", label: "Admin Dashboard", icon: SparklesIcon},
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const {currentUser, logout, isAuthenticated} = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.2),_transparent_30%),linear-gradient(180deg,_#0f172a_0%,_#111827_100%)] text-slate-100">
      <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-slate-950/92 px-4 py-5 text-slate-100 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <HeartIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">PawCare Admin</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({isActive}) =>
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
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur md:px-6">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/15 lg:hidden">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Admin portal
                  </p>
                  <p className="text-sm text-slate-400">Management console</p>
                </div>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <Badge variant="primary" className="inline-flex">
                  {isAuthenticated
                    ? `${currentUser?.name}${currentUser?.role === "admin" ? " · Admin" : ""}`
                    : "Guest"}
                </Badge>
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
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
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
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
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
