"use client";

export type DonutSlice = { label: string; value: number; color: string };

export default function DonutCard({
  title,
  subtitle,
  slices,
}: {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
}) {
  const total = slices.reduce((a, b) => a + b.value, 0) || 1;

  // build conic-gradient
  let acc = 0;
  const stops: string[] = [];
  slices.forEach((s) => {
    const start = (acc / total) * 100;
    acc += s.value;
    const end = (acc / total) * 100;
    stops.push(`${s.color} ${start}% ${end}%`);
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/70 p-4">
      <div className="mb-3">
        <h3 className="font-display text-lg">{title}</h3>
        {subtitle ? <p className="text-dim text-sm">{subtitle}</p> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-center">
        <div className="relative mx-auto h-40 w-40">
          <div
            className="h-full w-full rounded-full"
            style={{ background: gradient }}
            aria-hidden
          />
          <div className="absolute inset-4 rounded-full bg-surface/90 ring-1 ring-white/5 grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-semibold text-ink-100">{total}</div>
              <div className="text-xs text-dim">total</div>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2">
          {slices.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: s.color }}
                />
                <span className="text-sm">{s.label}</span>
              </span>
              <span className="text-sm text-ink-100">
                {Math.round((s.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
