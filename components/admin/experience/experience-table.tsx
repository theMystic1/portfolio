"use client";

// components/experience/experience-table.tsx
"use client";

import Badge from "@/components/ui/badge";
import DataTable, { Column } from "@/components/ui/table";
import { Experience } from "@/types";
import * as React from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

function fmtDate(d?: string | Date) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(+dt)) return "—";
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function ExperienceTable({
  data,
  onEdit,
  onDelete,
  onView,
}: {
  data: Experience[];
  onEdit?: (row: Experience) => void;
  onDelete?: (row: Experience) => void;
  onView?: (row: Experience) => void;
}) {
  const cols: Column<Experience>[] = [
    {
      key: "role",
      header: "Role",
      sortable: true,
      accessor: (r) => (
        <div>
          <div className="font-medium text-ink-100">{r.role}</div>
          <div className="text-xs text-dim">{r.company?.name}</div>
        </div>
      ),
      width: "24rem",
    },
    {
      key: "company.jobLocation",
      header: "Location",
      sortable: true,
      accessor: (r) => r.company?.jobLocation || "—",
      width: "10rem",
    },
    {
      key: "company.jobType",
      header: "Type",
      sortable: true,
      accessor: (r) =>
        r.company?.jobType ? (
          <Badge intent="info">{r.company.jobType}</Badge>
        ) : (
          <span className="text-dim">—</span>
        ),
      width: "8rem",
    },
    {
      key: "dates",
      header: "Dates",
      accessor: (r) => (
        <div className="flex items-center gap-2">
          <span>
            {fmtDate(r.startDate)} –{" "}
            {r.isCurrent ? "Present" : fmtDate(r.endDate)}
          </span>
          {r.isCurrent ? <Badge intent="success">Current</Badge> : null}
        </div>
      ),
      width: "14rem",
    },
    {
      key: "projects",
      header: "Projects",
      accessor: (r) => (
        <div className="flex items-center gap-2">
          <Badge intent="neutral">{r.projects?.length ?? 0}</Badge>
          <span className="text-xs text-dim">items</span>
        </div>
      ),
      width: "8rem",
    },
  ];

  return (
    <DataTable<Experience>
      data={data}
      columns={cols}
      searchableKeys={[
        "role",
        "company",
        "company.name",
        "company.jobLocation",
      ]}
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
