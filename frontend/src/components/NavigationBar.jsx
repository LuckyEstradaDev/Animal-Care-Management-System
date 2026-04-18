import {Link} from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-sm font-semibold tracking-wide text-slate-950">
          Animal Care
        </h1>
        <div className="flex items-center gap-2">
          <Link
            to="/auth?mode=login"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            to="/auth?mode=register"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Create account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
