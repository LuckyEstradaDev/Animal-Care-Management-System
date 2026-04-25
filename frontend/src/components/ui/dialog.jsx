import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

export function Dialog({ open, onOpenChange, title, description, children, className }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onOpenChange(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-slate-950/55"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
        className={cn(
          "relative z-10 max-h-[calc(100dvh-3rem)] w-full max-w-3xl overflow-hidden overflow-y-auto rounded-[1.5rem] border border-white/70 bg-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.45)] sm:rounded-[2rem]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 id="dialog-title" className="break-words text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              {title}
            </h2>
            {description ? (
              <p id="dialog-description" className="mt-1 break-words text-sm leading-6 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
        <div className={cn("px-4 py-4 sm:px-6 sm:py-6", className)}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
