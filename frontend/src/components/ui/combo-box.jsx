import { useMemo, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { cn } from "../../lib/cn";
import { Button } from "./button";

export function ComboBox({
  items = [],
  value,
  onChange,
  placeholder = "Select option...",
  className,
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo(
    () =>
      items.map((item) =>
        typeof item === "string" ? {label: item, value: item} : item,
      ),
    [items],
  );
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "h-11 w-full justify-between rounded-2xl px-4 text-left font-normal",
          !selectedOption && "text-slate-500",
          className,
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
      </Button>
      {open ? (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-950/10">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-800 hover:bg-emerald-50"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <FaCheck
                className={cn(
                  "h-3 w-3",
                  value === option.value ? "opacity-100" : "opacity-0",
                )}
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
