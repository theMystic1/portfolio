// app/(portfolio)/loading.tsx
"use client";

export default function PortfolioLoading() {
  return (
    <div
      className="min-h-screen w-full bg-background text-foreground relative overflow-hidden"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      {/* Soft hero gradient sweep */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-25 bg-emerald-500/40" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full blur-3xl opacity-15 bg-sky-500/40" />
        <div className="absolute bottom-0 -right-24 h-96 w-96 rounded-full blur-3xl opacity-15 bg-purple-500/40" />
      </div>

      {/* Fine grain / vignette */}
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        {/* Nav skeleton */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/8 border border-white/10 shimmer" />
            <div className="h-3 w-28 rounded bg-white/8 shimmer" />
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-lg bg-white/8 shimmer" />
            ))}
          </div>
        </header>

        {/* Hero skeleton */}
        <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          {/* Left hero text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="intro-line shimmer h-2 w-24 rounded-full bg-white/10" />

            <div className="space-y-3">
              <div className="h-10 w-5/6 rounded-xl bg-white/10 shimmer" />
              <div className="h-10 w-3/4 rounded-xl bg-white/10 shimmer" />
            </div>

            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded-lg bg-white/8 shimmer" />
              <div className="h-4 w-5/6 rounded-lg bg-white/8 shimmer" />
              <div className="h-4 w-2/3 rounded-lg bg-white/8 shimmer" />
            </div>

            <div className="mt-6 flex gap-3">
              <div className="h-10 w-32 rounded-xl bg-white/12 shimmer" />
              <div className="h-10 w-40 rounded-xl bg-white/8 shimmer" />
            </div>
          </div>

          {/* Right hero media placeholder */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square w-full rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="absolute inset-0 shimmer" />
              {/* diagonal sweep */}
              <div className="absolute inset-0 hero-sweep" />
            </div>
          </div>
        </section>

        {/* Section divider pulse (subtle, not spinner) */}
        <div className="mt-12 h-px w-full bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent divider-scan" />
        </div>

        {/* Projects preview skeleton */}
        <section className="mt-8">
          <div className="h-3 w-40 rounded bg-white/8 shimmer" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/4 p-4 space-y-3"
              >
                <div className="aspect-video w-full rounded-xl bg-white/10 shimmer" />
                <div className="h-4 w-2/3 rounded bg-white/10 shimmer" />
                <div className="h-3 w-full rounded bg-white/8 shimmer" />
                <div className="h-3 w-4/5 rounded bg-white/8 shimmer" />
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-16 rounded-full bg-white/8 shimmer" />
                  <div className="h-6 w-20 rounded-full bg-white/8 shimmer" />
                  <div className="h-6 w-14 rounded-full bg-white/8 shimmer" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience timeline skeleton */}
        <section className="mt-10">
          <div className="h-3 w-44 rounded bg-white/8 shimmer" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/4 p-4"
              >
                <div className="mt-1 h-10 w-10 rounded-xl bg-white/10 shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-white/10 shimmer" />
                  <div className="h-3 w-1/3 rounded bg-white/8 shimmer" />
                  <div className="h-3 w-5/6 rounded bg-white/8 shimmer" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-white/8 shimmer" />
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-auto pt-10 text-center text-xs text-white/50">
          Preparing portfolio…
        </footer>
      </div>

      {/* Animations */}
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
          animation: shimmer 1.4s infinite;
        }

        .divider-scan {
          animation: scan 1.6s ease-in-out infinite;
        }

        .hero-sweep {
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.06),
            transparent
          );
          transform: translateX(-100%);
          animation: heroSweep 2.2s ease-in-out infinite;
        }

        .vignette {
          background: radial-gradient(
            90% 90% at 50% 0%,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.35) 70%,
            rgba(0, 0, 0, 0.7) 100%
          );
          opacity: 0.6;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(120%);
          }
        }
        @keyframes scan {
          0% {
            transform: translateX(-120%);
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(220%);
            opacity: 0.3;
          }
        }
        @keyframes heroSweep {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer:after,
          .divider-scan,
          .hero-sweep {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
