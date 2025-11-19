// app/(admin)/experience/page.tsx
"use client";

import * as React from "react";
// import ExperienceTable from "@/components/experience/experience-table";
// import { Experience } from "@/types/experience";
import Button from "@/components/btn";
import { Experience } from "@/types";
import ExperienceTable from "./experience-table";
import {
  ExperienceCreateModal,
  ExperienceUpdateModal,
  ExperienceDeleteModal,
} from "@/components/modals/experience-modal";

const MOCK: Experience[] = [
  {
    _id: "1",
    role: "Associate Software Engineer",
    company: {
      name: "Basel Dynamic Tech Solutions",
      jobLocation: "Remote",
      jobType: "REMOTE",
    },
    projects: [
      {
        title: "Admin Platform",
        technologies: ["Next.js", "TypeScript"],
        features: ["RBAC", "Audit Trail"],
      },
    ],
    startDate: "2024-07-01",
    isCurrent: true,
  },
  {
    _id: "2",
    role: "Frontend Developer (Freelance)",
    company: {
      name: "SVS Detailing Services",
      jobLocation: "Lagos",
      jobType: "HYBRID",
    },
    projects: [
      { title: "Marketing Site", technologies: ["Next.js", "Tailwind"] },
    ],
    startDate: "2024-03-01",
    endDate: "2024-09-01",
  },
  {
    _id: "3",
    role: "Frontend Developer (Freelance)",
    company: {
      name: "SreeTeq Services",
      jobLocation: "Remote",
      jobType: "REMOTE",
    },
    projects: [{ title: "Web Revamp", technologies: ["React", "GSAP"] }],
    startDate: "2024-01-01",
    endDate: "2024-06-01",
  },
];

export default function ExperienceAdminPage() {
  const [rows, setRows] = React.useState<Experience[]>(MOCK);
  const [open, setOpen] = React.useState({
    edit: false,
    create: false,
    delete: false,
  });

  const [exp, setExp] = React.useState<any>();

  const handleOpen = (type: "edit" | "create" | "delete") =>
    setOpen((prv) => ({ ...prv, [type]: true }));
  const handleClose = (type: "edit" | "create" | "delete") =>
    setOpen((prv) => ({ ...prv, [type]: false }));

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <ExperienceUpdateModal
        open={open?.edit}
        onClose={() => {
          handleClose("edit");
          setExp(null);
        }}
        onUpdate={() => {}}
        initial={exp}
      />
      <ExperienceCreateModal
        open={open?.create}
        onClose={() => {
          handleClose("create");
          setExp(null);
        }}
        onCreate={() => {}}
      />
      <ExperienceDeleteModal
        open={open?.delete}
        onClose={() => {
          handleClose("delete");
          setExp(null);
        }}
        onDelete={() => {}}
        label="Delete"
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">Experience</h1>
          <p className="text-dim text-sm">
            Manage your roles, companies, and projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="goldGradient" onClick={() => handleOpen("create")}>
            + Add Experience
          </Button>
          <Button variant="surface" onClick={() => alert("Import CSV")}>
            Import
          </Button>
        </div>
      </div>

      {/* Table */}
      <ExperienceTable
        data={rows}
        onView={(r) => alert(`View: ${r.role}`)}
        onEdit={(r) => {
          handleOpen("edit");
          setExp(r);
        }}
        onDelete={(r) => handleOpen("delete")}
      />
    </div>
  );
}
