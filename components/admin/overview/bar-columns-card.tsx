"use client";

import * as React from "react";

export type BarDatum = { label: string; value: number; color: string };

export default function BarColumnsCard({
  title,
  subtitle,
  data,
  max, // highest scale (fallback to max in data)
}: {
  title: string;
  subtitle?: string;
  data: BarDatum[];
  max?: number;
}) {
  const peak = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/70 p-4">
      <div className="mb-3">
        <h3 className="font-display text-lg">{title}</h3>
        {subtitle ? <p className="text-dim text-sm">{subtitle}</p> : null}
      </div>

      <div className="grid gap-3">
        {data.map((d) => {
          const pct = Math.max(4, Math.min(100, (d.value / peak) * 100));
          return (
            <div
              key={d.label}
              className="grid grid-cols-[8rem_1fr_auto] items-center gap-3"
            >
              <div className="truncate text-sm text-ink-100">{d.label}</div>
              <div className="relative h-3 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: d.color,
                    boxShadow: "0 0 16px rgba(255,255,255,0.08) inset",
                  }}
                />
              </div>
              <div className="text-sm tabular-nums text-ink-100">{d.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
