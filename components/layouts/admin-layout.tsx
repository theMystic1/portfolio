"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../admin/side-bar";

const NAV = [
  { label: "Overview", href: "/admin-overview", icon: "FiGrid" },
  { label: "Experience", href: "/admin-experience", icon: "FiUsers" },
  { label: "Projects", href: "/admin-projects", icon: "FiFolder" },
  { label: "Technologies", href: "/admin-technologies", icon: "FiCreditCard" },
  // { label: "Settings", href: "/admin/settings", icon: "FiSettings" },
] as const;

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false); // mobile drawer open
  const [collapsed, setCollapsed] = React.useState(false); // md+ collapse
  const pathname = usePathname();

  // Close mobile drawer when route changes
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      className={`min-h-screen bg-bg text-ink-100 grid  ${
        collapsed ? "grid-cols-[100px_1fr]" : "grid-cols-[250px_1fr]"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        nav={NAV}
        open={open}
        collapsed={collapsed}
        onToggleOpen={() => setOpen((v) => !v)}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />

      {/* Main */}
      <div
        className={`transition-[margin] duration-300 md:${
          collapsed ? "ml-20 " : "ml-80"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-surface/60 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              {/* burger */}
              <span className="block h-0.5 w-4 bg-ink-100 mb-1" />
              <span className="block h-0.5 w-4 bg-ink-100 mb-1" />
              <span className="block h-0.5 w-4 bg-ink-100" />
            </button>

            {/* Page title placeholder */}
            <h1 className="text-lg font-semibold">Admin</h1>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="hidden md:inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10"
                aria-pressed={collapsed}
              >
                {collapsed ? "Expand" : "Collapse"}
              </button>
              <div className="h-9 w-9 rounded-full bg-aurora-400/20 border border-white/10 grid place-items-center">
                <span className="text-xs">LU</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
