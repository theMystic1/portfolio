// components/technologies/technology-table.tsx
"use client";

import * as React from "react";
import Image from "next/image";

import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { Technology } from "@/types";
import DataTable, { Column } from "@/components/ui/table";

function ColorDot({ color }: { color?: string }) {
  const dot = color || "#8884"; // soft fallback
  return (
    <span
      className="inline-block h-3 w-3 rounded-full ring-2 ring-white/10"
      style={{ background: dot }}
      aria-hidden="true"
    />
  );
}

function TechCell({ t }: { t: Technology }) {
  const hasIcon = Boolean(t.icon);
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-8 w-8 shrink-0 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center overflow-hidden">
        {hasIcon ? (
          // If using remote icons, remember to allow domain in next.config.js
          <Image
            src={t.icon!}
            alt={t.name}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <ColorDot color={t.color} />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-ink-100 font-medium">{t.name}</div>
        <div className="text-xs text-dim truncate">
          {t.color ? t.color : "No color"}
        </div>
      </div>
    </div>
  );
}

export default function TechnologyTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: Technology[];
  onView?: (row: Technology) => void;
  onEdit?: (row: Technology) => void;
  onDelete?: (row: Technology) => void;
}) {
  const columns: Column<Technology>[] = [
    {
      key: "name",
      header: "Technology",
      sortable: true,
      accessor: (row) => <TechCell t={row} />,
      width: "24rem",
    },
    {
      key: "color",
      header: "Color",
      accessor: (row) =>
        row.color ? (
          <div className="flex items-center gap-2">
            <ColorDot color={row.color} />
            <span className="text-sm">{row.color}</span>
          </div>
        ) : (
          <span className="text-dim">—</span>
        ),
      width: "14rem",
    },
    {
      key: "updatedAt",
      header: "Updated",
      accessor: (row) =>
        row.updatedAt
          ? new Date(row.updatedAt).toLocaleString()
          : new Date(row.createdAt ?? Date.now()).toLocaleString(),
      width: "16rem",
    },
  ];

  return (
    <DataTable<Technology>
      data={data}
      columns={columns}
      searchableKeys={["name", "color"]}
      rowKey={(r, i) => r._id ?? i}
      actions={(row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            className="h-9 w-9 grid place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => onView?.(row)}
            aria-label="View"
          >
            <FiEye />
          </button>
          <button
            className="h-9 w-9 grid place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => onEdit?.(row)}
            aria-label="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            className="h-9 w-9 grid place-items-center rounded-lg border border-danger-500/30 bg-danger-500/10 text-danger-500 hover:bg-danger-500/20"
            onClick={() => onDelete?.(row)}
            aria-label="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      )}
      stickyHeader
    />
  );
}
