// components/admin/badge.tsx
"use client";

import clsx from "clsx";

export default function Badge({
  children,
  intent = "neutral",
  className,
}: {
  children: React.ReactNode;
  intent?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const map = {
    neutral: "bg-white/8 text-ink-100 border-white/10",
    success: "bg-success-500/15 text-success-500 border-success-500/30",
    warning: "bg-warning-500/15 text-warning-500 border-warning-500/30",
    danger: "bg-danger-500/15 text-danger-500 border-danger-500/30",
    info: "bg-info-500/15 text-info-500 border-info-500/30",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
        map[intent],
        className
      )}
    >
      {children}
    </span>
  );
}
