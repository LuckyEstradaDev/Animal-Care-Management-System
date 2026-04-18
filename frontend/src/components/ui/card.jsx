import { cn } from "../../lib/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/70 bg-white/85 p-0 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("space-y-1.5 p-6 pb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-slate-900", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm leading-6 text-slate-600", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 px-6 pb-6", className)}
      {...props}
    />
  );
}
