import {Link} from "react-router-dom";
import {HeartIcon} from "./icons";

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-20 border-b border-white/20 bg-slate-950/55 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
            <HeartIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              PawCare
            </p>
            <p className="text-xs text-slate-300">
              Animal Care Management System
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#about"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            About
          </a>
          <Link
            to="/auth?mode=login"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-emerald-50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
