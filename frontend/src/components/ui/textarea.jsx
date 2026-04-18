import { cn } from "../../lib/cn";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className,
      )}
      {...props}
    />
  );
}
