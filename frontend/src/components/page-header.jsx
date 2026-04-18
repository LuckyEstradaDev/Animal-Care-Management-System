import { Badge } from "./ui/badge";
import { cn } from "../lib/cn";

export function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <Badge variant="soft" className="mb-2">
            {eyebrow}
          </Badge>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
