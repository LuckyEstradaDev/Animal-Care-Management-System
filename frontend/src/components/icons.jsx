function IconShell({ children, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SparklesIcon({ className = "h-5 w-5" }) {
  return (
    <IconShell className={className}>
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.9 4.9l2.8 2.8" />
      <path d="M16.3 16.3l2.8 2.8" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M12 8l1.1 2.9L16 12l-2.9 1.1L12 16l-1.1-2.9L8 12l2.9-1.1z" />
    </IconShell>
  );
}

export function HeartIcon({ className = "h-5 w-5" }) {
  return (
    <IconShell className={className}>
      <path d="M20.8 6.6a5.6 5.6 0 0 0-8-.1L12 7.3l-.8-.8a5.6 5.6 0 0 0-8 7.9L12 22l8.8-7.6a5.6 5.6 0 0 0 0-7.8Z" />
    </IconShell>
  );
}

export function CalendarIcon({ className = "h-5 w-5" }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </IconShell>
  );
}

export function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <IconShell className={className}>
      <path d="M12 3 19 6v5c0 4.9-3.2 8.7-7 10-3.8-1.3-7-5.1-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </IconShell>
  );
}

export function BellIcon({ className = "h-5 w-5" }) {
  return (
    <IconShell className={className}>
      <path d="M15 17H9" />
      <path d="M10 18a2 2 0 0 0 4 0" />
      <path d="M6.4 14.5A2.4 2.4 0 0 0 8 12.3V10a4 4 0 0 1 8 0v2.3c0 .8.3 1.5.9 2.1l1.1 1.1H4.4l2-1Z" />
    </IconShell>
  );
}

export function StethoscopeIcon({ className = "h-5 w-5" }) {
  return (
    <IconShell className={className}>
      <path d="M6 3v6a6 6 0 0 0 12 0V3" />
      <path d="M6 9a3 3 0 0 0 6 0" />
      <path d="M18 12v2a4 4 0 0 1-8 0v-2" />
      <circle cx="18" cy="18" r="3" />
    </IconShell>
  );
}
