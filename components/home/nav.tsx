"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type MenuItem = { label: string; href: string; accent: string };

const MENU: MenuItem[] = [
  { label: "Home", href: "#home", accent: "var(--gold-500)" },
  { label: "About", href: "#about", accent: "var(--aurora-400)" },
  { label: "Experience", href: "#experience", accent: "var(--teal-400)" },
  { label: "Skills", href: "#skills", accent: "var(--info-500)" },
  { label: "Projects", href: "#projects", accent: "var(--ember-500)" },
  { label: "Contact", href: "#contact", accent: "var(--coral-500)" },
];

const HeaderNav: React.FC = () => {
  const headerRef = React.useRef<HTMLElement | null>(null);
  const shellRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const [active, setActive] = React.useState(0);
  const activeRef = React.useRef(0);
  React.useEffect(() => void (activeRef.current = active), [active]);

  // stable setter for desktop item refs
  const makeItemRef = (i: number) => (el: HTMLAnchorElement | null) => {
    itemRefs.current[i] = el;
  };

  // indicator mover (defined post-mount)
  const moveIndicatorRef = React.useRef<(index: number) => void>(() => {});
  React.useEffect(() => {
    moveIndicatorRef.current = (index: number) => {
      const indicator = indicatorRef.current;
      const track = trackRef.current;
      const el = itemRefs.current[index];
      if (!indicator || !track || !el) return;
      const styles = getComputedStyle(el);
      const leftPad = parseFloat(styles.paddingLeft || "0");
      const x = el.offsetLeft + leftPad;
      const w = Math.max(0, el.offsetWidth - leftPad * 2);
      gsap.to(indicator, {
        x,
        width: w,
        duration: 0.28,
        ease: "power2.out",
        boxShadow: "0 0 18px rgba(245,200,76,0.28)",
        background:
          "linear-gradient(90deg, var(--gold-500) 0%, var(--amber-600) 100%)",
      });
    };
  }, []);

  // header pop on scroll + entrance
  useGSAP(() => {
    const bar = shellRef.current;
    if (!bar) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(bar, {
      backgroundColor: "rgba(17,25,39,0.16)",
      borderColor: "rgba(255,255,255,0.06)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      backdropFilter: "blur(6px)",
    });

    const popTL = gsap.timeline({
      paused: true,
      defaults: { duration: 0.35, ease: "power2.out" },
    });
    popTL.to(bar, {
      backgroundColor: "rgba(17,25,39,0.72)",
      borderColor: "rgba(255,255,255,0.10)",
      boxShadow: "0 8px 28px rgba(0,0,0,0.35), 0 0 22px rgba(245,200,76,0.18)",
      backdropFilter: "blur(12px)",
    });

    if (!prefersReduced) {
      const els = itemRefs.current.filter(Boolean) as HTMLElement[];
      gsap.from(els, {
        y: -8,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.05,
      });
    }

    const THRESHOLD = 6;
    const sync = () =>
      window.scrollY > THRESHOLD ? popTL.play() : popTL.reverse();
    sync();
    const st = ScrollTrigger.create({ start: 0, end: 999999, onUpdate: sync });
    return () => {
      st.kill();
      popTL.kill();
    };
  }, []);

  // section-aware active link + initial indicator
  useGSAP(() => {
    const triggers: ScrollTrigger[] = [];
    MENU.forEach((m, i) => {
      const id = m.href.startsWith("#") ? m.href : `#${m.href}`;
      const sec = document.querySelector(id);
      if (!sec) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: sec,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      );
    });
    requestAnimationFrame(() => moveIndicatorRef.current(activeRef.current));
    return () => triggers.forEach((t) => t.kill());
  }, []);

  React.useEffect(() => {
    const handle = () => moveIndicatorRef.current(activeRef.current);
    window.addEventListener("resize", handle);
    window.addEventListener("pageshow", handle);
    document.fonts?.ready?.then?.(handle);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("pageshow", handle);
    };
  }, []);

  React.useEffect(() => moveIndicatorRef.current(active), [active]);

  const onClickLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    i: number,
    href: string
  ) => {
    e.preventDefault();
    const id = href.startsWith("#") ? href : `#${href}`;
    const el = document.querySelector(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(i);
  };

  // ------------------ MOBILE DRAWER ------------------
  const [open, setOpen] = React.useState(false);
  const drawerRootRef = React.useRef<HTMLDivElement | null>(null);
  const drawerPanelRef = React.useRef<HTMLDivElement | null>(null);
  const drawerScrimRef = React.useRef<HTMLButtonElement | null>(null);
  const drawerItemRefs = React.useRef<HTMLAnchorElement[]>([]);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);

  // stable ref setters for drawer links
  const makeDrawerItemRef = (i: number) => (el: HTMLAnchorElement | null) => {
    if (!el) return;
    drawerItemRefs.current[i] = el;
  };

  // build timeline once
  useGSAP(() => {
    const root = drawerRootRef.current;
    const panel = drawerPanelRef.current;
    const scrim = drawerScrimRef.current;
    if (!root || !panel || !scrim) return;

    gsap.set(root, { display: "none" });
    gsap.set(panel, { xPercent: 100, opacity: 0 });
    gsap.set(scrim, { opacity: 0 });

    tlRef.current = gsap
      .timeline({ paused: true, defaults: { ease: "power3.out" } })
      .set(root, { display: "block" })
      .to(scrim, { opacity: 1, duration: 0.25 })
      .to(panel, { xPercent: 0, opacity: 1, duration: 0.5 }, "<-0.05")
      .from(
        drawerItemRefs.current,
        {
          y: 16,
          autoAlpha: 0,
          duration: 0.35,
          stagger: 0.06,
        },
        "-=0.2"
      );
  }, []);

  // open/close with scroll locking
  React.useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      tl.play(0);
    } else {
      document.documentElement.style.overflow = "";
      tl.reverse().eventCallback("onReverseComplete", () => {
        gsap.set(drawerRootRef.current, { display: "none" });
      });
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const closeAndScroll = (i: number, href: string) => {
    const id = href.startsWith("#") ? href : `#${href}`;
    const el = document.querySelector(id);
    setOpen(false);
    if (el) {
      setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        220
      );
      setActive(i);
    }
  };

  return (
    <nav ref={headerRef} className="h-20 p-2 top-0 right-0 left-0">
      <header
        ref={shellRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 rounded-xl py-3 px-4 bg-surface/40 border border-soft supports-backdrop-filter:backdrop-blur-md min-h-12"
      >
        <div className="mx-auto flex items-center justify-between gap-4">
          <h1 className="logo-mark select-none">MR CLU</h1>

          {/* Desktop menu */}
          <div
            ref={trackRef}
            className="relative hidden md:flex flex-wrap items-center gap-1.5 md:gap-2 pb-2"
          >
            {/* underline indicator */}
            <div
              ref={indicatorRef}
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{ width: 0, transform: "translateX(0px)" }}
              aria-hidden="true"
            />
            {MENU.map((m, i) => {
              const isActive = i === active;
              return (
                <a
                  key={m.label}
                  ref={makeItemRef(i)}
                  href={m.href}
                  onClick={(e) => onClickLink(e, i, m.href)}
                  className={[
                    "group relative inline-flex items-center gap-2 rounded-lg",
                    "px-3 py-1.5 text-sm transition-colors",
                    "text-ink-300 hover:text-white",
                    isActive ? "bg-white/5" : "hover:bg-white/5",
                    "border border-transparent hover:border-white/10",
                  ].join(" ")}
                  style={{ ["--accent" as any]: m.accent }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <span
                    className={`relative ${
                      isActive
                        ? "bg-linear-to-r from-aurora-400 via-coral-500 to-gold-500 text-transparent bg-clip-text"
                        : ""
                    }`}
                  >
                    {m.label}
                    <span
                      className={`absolute left-0 right-0 -bottom-2 h-0.5 rounded-full transition-opacity ${
                        isActive
                          ? "opacity-60"
                          : "opacity-0 group-hover:opacity-40"
                      }`}
                      style={{
                        background:
                          "linear-gradient(90deg, var(--accent), rgba(255,255,255,0))",
                      }}
                    />
                  </span>
                </a>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <span className="relative block h-3.5 w-5">
              <span className="absolute inset-x-0 top-0 h-0.5 bg-ink-300 rounded" />
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-ink-300 rounded" />
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-300 rounded" />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer (full-width, not full-height) */}
      <div
        ref={drawerRootRef}
        className="fixed inset-0 z-60 hidden md:hidden"
        role="dialog"
        aria-modal="true"
        aria-hidden={open ? "false" : "true"}
      >
        {/* scrim */}
        <button
          ref={drawerScrimRef}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />

        {/* panel */}
        <div
          ref={drawerPanelRef}
          className="
      absolute left-0 right-0 top-0
      w-full h-[80vh] max-h-[720px]
      rounded-b-2xl
      bg-surface border-t border-white/10 shadow-xl
      p-5 overflow-y-auto
    "
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="logo-mark text-xl">MR CLU</span>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <span className="relative block h-3.5 w-3.5 rotate-45">
                <span className="absolute inset-0 h-0.5 bg-ink-300 rounded rotate-90" />
                <span className="absolute inset-0 h-0.5 bg-ink-300 rounded" />
              </span>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {MENU.map((m, i) => (
              <a
                key={m.label}
                ref={makeDrawerItemRef(i)}
                href={m.href}
                onClick={(e) => {
                  e.preventDefault();
                  closeAndScroll(i, m.href);
                }}
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink-100"
                style={{ ["--accent" as any]: m.accent }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <span>{m.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
