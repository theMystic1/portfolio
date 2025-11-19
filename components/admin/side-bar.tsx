"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  FiGrid,
  FiUsers,
  FiFolder,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import InitialsLogo from "../ui/initials-logo";

type Item = { label: string; href: string; icon: keyof typeof ICONS };
type Props = {
  nav: ReadonlyArray<Item>;
  open: boolean; // mobile drawer open
  collapsed: boolean; // md+ collapsed
  onToggleOpen: () => void; // open/close mobile
  onToggleCollapsed: () => void; // collapse/expand md+
};

const ICONS = {
  FiGrid,
  FiUsers,
  FiFolder,
  FiCreditCard,
  FiSettings,
};

export default function Sidebar({
  nav,
  open,
  collapsed,
  onToggleOpen,
  onToggleCollapsed,
}: Props) {
  const pathname = usePathname();

  // Desktop (md+) rail
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onToggleOpen}
      />

      {/* Panel (mobile) */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-[80%] w-full max-w-[20rem] rounded-br-2xl",
          "bg-surface/95 border-r border-white/10 backdrop-blur-md p-4",
          "transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-4">
          <Brand collapsed={false} />
          <button
            onClick={onToggleOpen}
            className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <NavList items={nav} pathname={pathname} collapsed={false} />
        <FooterActions collapsed={false} />
      </aside>

      {/* Desktop rail */}
      <aside
        className={clsx(
          "fixed left-0 top-0 hidden md:flex md:flex-col md:h-screen",
          "border-r border-white/10 bg-surface/80 backdrop-blur-md",
          "transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className={clsx("p-4", collapsed && "px-3")}>
          <Brand collapsed={collapsed} />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none px-2">
          <NavList items={nav} pathname={pathname} collapsed={collapsed} />
        </div>

        <div className={clsx("p-3", collapsed && "px-2")}>
          <FooterActions collapsed={collapsed} />
          <button
            onClick={onToggleCollapsed}
            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm hover:bg-white/10"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </aside>

      {/* Spacer so main content doesn't hide under desktop rail */}
      <div className={clsx("hidden md:block", collapsed ? "w-20" : "w-64")} />
    </>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <InitialsLogo size={36} text="LU" />

      {!collapsed && (
        <div>
          <div className="logo-mark text-base leading-none">MR CLU</div>
          <div className="text-[11px] text-dim">Admin</div>
        </div>
      )}
    </div>
  );
}

function NavList({
  items,
  pathname,
  collapsed,
}: {
  items: ReadonlyArray<{
    label: string;
    href: string;
    icon: keyof typeof ICONS;
  }>;
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const Icon = ICONS[it.icon];
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={clsx(
              "group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition",
              active
                ? "border-amber-600/50 bg-white/8 text-white"
                : "border-white/10 bg-white/[0.04] text-ink-300 hover:bg-white/[0.08] hover:text-ink-100"
            )}
          >
            <Icon
              className={clsx("h-4 w-4 shrink-0", active && "text-amber-600")}
            />
            {!collapsed && <span className="truncate">{it.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function FooterActions({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="mt-2">
      <button className="w-full inline-flex items-center gap-3 rounded-lg border border-white/10 bg-danger-500/15 px-3 py-2 text-sm text-danger-500 hover:bg-danger-500/25">
        <FiLogOut className="h-4 w-4" />
        {!collapsed && <span>Sign out</span>}
      </button>
    </div>
  );
}
