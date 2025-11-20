// app/not-found.tsx

"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-emerald-500/40" />
        <div className="absolute top-1/3 -right-28 h-96 w-96 rounded-full blur-3xl opacity-15 bg-sky-500/40" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full blur-3xl opacity-15 bg-purple-500/40" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-white/70">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-white/70">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition"
            >
              Back to homepage
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5 transition"
            >
              View projects
            </Link>
          </div>

          <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent animate-[scan_1.6s_ease-in-out_infinite]" />
          </div>
        </div>

        <style jsx global>{`
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
        `}</style>
      </main>
    </div>
  );
}
