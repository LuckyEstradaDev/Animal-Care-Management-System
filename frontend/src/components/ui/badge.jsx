import { cn } from "../../lib/cn";

const variants = {
  default: "bg-slate-100 text-slate-700",
  primary: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-rose-100 text-rose-800",
  dark: "bg-slate-900 text-white",
  soft: "bg-emerald-50 text-emerald-800 border border-emerald-100",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
