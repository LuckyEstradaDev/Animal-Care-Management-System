const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <h1 className="text-sm font-semibold tracking-wide text-slate-950">Animal Care</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Register
          </button>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            Create account
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
