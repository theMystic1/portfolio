// components/projects/project-table.tsx
"use client";

import * as React from "react";
import Image from "next/image";

import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import Badge from "@/components/ui/badge";
import { Project } from "@/types";
import DataTable, { Column } from "@/components/ui/table";

function TechStack({ techs }: { techs: string[] }) {
  if (!techs?.length) return <span className="text-dim">—</span>;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {techs.slice(0, 4).map((t) => (
        <span
          key={t}
          className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-ink-100 ring-1 ring-white/10"
        >
          {t}
        </span>
      ))}
      {techs.length > 4 && <Badge intent="neutral">+{techs.length - 4}</Badge>}
    </div>
  );
}

function FeaturesCount({ features }: { features?: string[] }) {
  const n = features?.length ?? 0;
  return (
    <div className="flex items-center gap-2">
      <Badge intent="neutral">{n}</Badge>
      <span className="text-xs text-dim">features</span>
    </div>
  );
}

export default function ProjectTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: Project[];
  onView?: (row: Project) => void;
  onEdit?: (row: Project) => void;
  onDelete?: (row: Project) => void;
}) {
  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Project",
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10 bg-white/5">
            <Image
              src={row.coverImage}
              alt={row.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-ink-100 font-medium">{row.title}</div>
            <div className="truncate text-xs text-dim">
              {row.description ?? "—"}
            </div>
          </div>
        </div>
      ),
      width: "28rem",
    },
    {
      key: "technologies",
      header: "Technologies",
      accessor: (row) => <TechStack techs={row.technologies} />,
      width: "18rem",
    },
    {
      key: "features",
      header: "Features",
      accessor: (row) => <FeaturesCount features={row.features} />,
      width: "10rem",
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
    <DataTable<Project>
      data={data}
      columns={columns}
      searchableKeys={["title", "description", "technologies"]}
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
