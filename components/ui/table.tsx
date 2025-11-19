// components/admin/data-table.tsx
"use client";

import * as React from "react";
import clsx from "clsx";

export type Column<T> = {
  key: keyof T | string;
  header: string | React.ReactNode;
  width?: string;
  className?: string;
  sortable?: boolean;
  accessor?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowKey?: (row: T, index: number) => string | number;
  pageSize?: number;
  searchableKeys?: (keyof T | string)[];
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  stickyHeader?: boolean;
  onRowClick?: (row: T) => void;
};

export default function DataTable<T>({
  data,
  columns,
  rowKey = (_, i) => i,
  pageSize = 10,
  searchableKeys = [],
  actions,
  emptyMessage = "No data found",
  stickyHeader = true,
  onRowClick,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{
    by?: string;
    dir: "asc" | "desc";
  }>({
    by: "",
    dir: "desc",
  });

  const filtered = React.useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchableKeys.some((k) => {
        const v =
          typeof k === "string" ? (row as any)[k] : (row as any)[k as keyof T];
        return String(v ?? "")
          .toLowerCase()
          .includes(q);
      })
    );
  }, [data, query, searchableKeys]);

  const sorted = React.useMemo(() => {
    if (!sort.by) return filtered;
    const dir = sort.dir === "desc" ? -1 : 1;
    const by = sort.by;
    return [...filtered].sort((a: any, b: any) => {
      const av = typeof by === "string" ? a[by] : a[by as any];
      const bv = typeof by === "string" ? b[by] : b[by as any];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  React.useEffect(() => {
    setPage(1);
  }, [query, sort.by, sort.dir]);

  return (
    <div className="space-y-3">
      {/* toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display text-xl">Experience</h3>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="h-10 rounded-lg bg-white/5 px-3 text-sm border border-white/10 focus:outline-none focus:border-aurora-400"
          />
        </div>
      </div>

      {/* table */}
      <div className="overflow-auto rounded-xl border border-white/10 bg-surface/70">
        <table className="w-full text-sm">
          <thead
            className={clsx(
              "text-ink-300",
              stickyHeader && "sticky top-0 z-10 bg-surface/80 backdrop-blur-sm"
            )}
          >
            <tr className="border-b border-white/10">
              {columns.map((c, i) => {
                const active = sort.by === c.key;
                return (
                  <th
                    key={i}
                    className={clsx(
                      "px-3 py-3 text-left font-normal",
                      c.className
                    )}
                    style={{ width: c.width }}
                  >
                    {c.sortable ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-ink-100"
                        onClick={() =>
                          setSort((s) => ({
                            by: String(c.key),
                            dir:
                              s.by === c.key
                                ? s.dir === "asc"
                                  ? "desc"
                                  : "asc"
                                : "asc",
                          }))
                        }
                        aria-pressed={active}
                      >
                        <span className="font-display">{c.header}</span>
                        <span className="text-[11px] opacity-70">
                          {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    ) : (
                      <span className="font-display">{c.header}</span>
                    )}
                  </th>
                );
              })}
              {actions && (
                <th className="px-3 py-3 text-right font-display">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {current.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-3 py-10 text-center text-dim"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              current.map((row, rIdx) => {
                const k = rowKey(row, rIdx);
                return (
                  <tr
                    key={k}
                    className={clsx(
                      "border-b border-white/5 hover:bg-white/[0.03] transition",
                      rIdx % 2 === 1 && "bg-white/[0.02]",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((c, i) => (
                      <td key={i} className={clsx("px-3 py-3", c.className)}>
                        {c.accessor
                          ? c.accessor(row)
                          : (row as any)[c.key as any]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-3 py-3 text-right">{actions(row)}</td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-dim">
          Page {page} of {totalPages} • {sorted.length} items
        </span>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost h-9 px-3 text-sm disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn btn-ghost h-9 px-3 text-sm disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
