"use client";

import * as React from "react";

/** tiny inline sparkline (no libs) */
function Sparkline({ series }: { series: number[] }) {
  const w = 120;
  const h = 36;
  const pad = 4;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const scaleX = (i: number) =>
    pad + (i * (w - pad * 2)) / Math.max(1, series.length - 1);
  const scaleY = (v: number) =>
    h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);

  const path = series
    .map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`)
    .join(" ");

  // area fill for nice vibe
  const area =
    `M ${scaleX(0)} ${h - pad} ` +
    series.map((v, i) => `L ${scaleX(i)} ${scaleY(v)}`).join(" ") +
    ` L ${scaleX(series.length - 1)} ${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className="overflow-visible"
      aria-hidden
    >
      <path d={area} fill="url(#grad)" opacity={0.25} />
      <path
        d={path}
        stroke="url(#grad)"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--color-aurora-400)" />
          <stop offset="60%" stopColor="var(--color-coral-500)" />
          <stop offset="100%" stopColor="var(--color-gold-500)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function KpiCard({
  label,
  value,
  delta,
  series,
}: {
  label: string;
  value: number | string;
  delta?: number; // +/- change
  series?: number[];
}) {
  const up = (delta ?? 0) > 0;
  const down = (delta ?? 0) < 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-dim text-xs uppercase tracking-wider">{label}</p>
          <div className="mt-1 flex items-end gap-2">
            <div className="text-2xl font-semibold text-ink-100">{value}</div>
            {delta !== undefined && (
              <span
                className={[
                  "text-xs rounded-full px-2 py-0.5",
                  up
                    ? "bg-success-500/15 text-success-500"
                    : down
                    ? "bg-danger-500/15 text-danger-500"
                    : "bg-white/5 text-ink-300",
                ].join(" ")}
              >
                {up ? "▲" : down ? "▼" : "—"} {Math.abs(delta)}
              </span>
            )}
          </div>
        </div>
        {series && (
          <div className="shrink-0">
            <Sparkline series={series} />
          </div>
        )}
      </div>
    </div>
  );
}
