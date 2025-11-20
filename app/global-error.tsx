// app/global-error.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="bg-background text-foreground">
        <div className="min-h-screen w-full relative overflow-hidden">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-rose-500/40" />
            <div className="absolute top-1/3 -right-28 h-96 w-96 rounded-full blur-3xl opacity-15 bg-amber-500/40" />
            <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full blur-3xl opacity-15 bg-purple-500/40" />
          </div>

          {/* Subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
            <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:42px_42px]" />
          </div>

          <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <div className="h-6 w-1 rounded-full bg-white/70" />
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                We’re having trouble right now
              </h1>
              <p className="mt-2 text-sm text-white/70">
                A critical error occurred. Please try reloading the app or come
                back in a bit.
              </p>

              {process.env.NODE_ENV === "development" && (
                <pre className="mt-4 max-h-40 w-full overflow-auto rounded-lg bg-black/30 p-3 text-left text-xs text-white/70">
                  {error.message}
                </pre>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition"
                >
                  Reload app
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5 transition"
                >
                  Home
                </Link>
              </div>

              <p className="mt-5 text-xs text-white/50">
                Error ID: {error.digest ?? "N/A"}
              </p>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
