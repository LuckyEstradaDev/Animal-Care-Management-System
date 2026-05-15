import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {HeartIcon, ShieldIcon, SparklesIcon} from "../icons";
import {cn} from "../../lib/cn";
import {useAuth} from "../../context/AuthContext";

const navigation = [
  {to: "/admin", label: "Admin Dashboard", icon: SparklesIcon},
  {to: "/admin/view-adoption", label: "Pet Adoption", icon: SparklesIcon},
  {to: "/admin/appointment", label: "Pet Appointment", icon: SparklesIcon},
  {to: "/admin/pets-list", label: "Registered Pets", icon: SparklesIcon},
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const {currentUser, logout, isAuthenticated} = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eefaf4_100%)] text-slate-900">
      <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white/92 px-4 py-5 text-slate-900 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <HeartIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">PawCare Admin</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 h-12 w-full px-3 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur md:px-6">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/15 lg:hidden">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Admin portal
                  </p>
                  <p className="text-sm text-slate-600">Management console</p>
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
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
