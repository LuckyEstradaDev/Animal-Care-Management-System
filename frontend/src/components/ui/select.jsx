import { cn } from "../../lib/cn";

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
