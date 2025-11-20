// app/loading.tsx
"use client";
export default function Loading() {
  return (
    <div
      className="min-h-screen w-full bg-background text-foreground relative overflow-hidden"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-emerald-500/40" />
        <div className="absolute top-1/3 -right-28 h-96 w-96 rounded-full blur-3xl opacity-20 bg-sky-500/40" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full blur-3xl opacity-20 bg-purple-500/40" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      {/* Center frame */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        {/* Top bar / header skeleton */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="h-10 w-10 rounded-xl bg-white/8 border border-white/10 shimmer" />
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-white/8 shimmer" />
              <div className="h-3 w-20 rounded bg-white/6 shimmer" />
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-9 w-24 rounded-lg bg-white/8 shimmer" />
            <div className="h-9 w-32 rounded-lg bg-white/8 shimmer" />
          </div>
        </header>

        {/* Progress line (not a spinner) */}
        <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent progress-scan" />
        </div>

        {/* Main content skeleton */}
        <main className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar skeleton */}
          <aside className="lg:col-span-3 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-2 py-2"
              >
                <div className="h-8 w-8 rounded-lg bg-white/8 shimmer" />
                <div className="h-3 w-3/4 rounded bg-white/8 shimmer" />
              </div>
            ))}
          </aside>

          {/* Content skeleton */}
          <section className="lg:col-span-9 space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/4 p-4"
                >
                  <div className="h-3 w-24 rounded bg-white/8 shimmer" />
                  <div className="mt-4 h-8 w-2/3 rounded bg-white/10 shimmer" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-white/6 shimmer" />
                </div>
              ))}
            </div>

            {/* Chart / big panel */}
            <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-40 rounded bg-white/8 shimmer" />
                <div className="h-8 w-24 rounded-lg bg-white/8 shimmer" />
              </div>

              <div className="mt-6 grid grid-cols-12 gap-3">
                {/* fake chart bars */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-1 flex items-end"
                    style={{ height: 160 }}
                  >
                    <div
                      className="w-full rounded-md bg-white/10 shimmer"
                      style={{ height: `${30 + (i % 6) * 18}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* List skeleton */}
            <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="h-3 w-32 rounded bg-white/8 shimmer" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-3 py-3"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-10 w-10 rounded-lg bg-white/8 shimmer" />
                      <div className="space-y-2 w-full">
                        <div className="h-3 w-1/2 rounded bg-white/8 shimmer" />
                        <div className="h-3 w-2/3 rounded bg-white/6 shimmer" />
                      </div>
                    </div>
                    <div className="ml-4 h-8 w-20 rounded-lg bg-white/8 shimmer" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer note */}
        <footer className="mt-auto pt-10 text-center text-xs text-white/50">
          Loading your workspace…
        </footer>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer:after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.12),
            transparent
          );
          animation: shimmer 1.35s infinite;
        }
        .progress-scan {
          animation: scan 1.2s ease-in-out infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(120%);
          }
        }
        @keyframes scan {
          0% {
            transform: translateX(-120%);
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(360%);
            opacity: 0.4;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer:after,
          .progress-scan {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
