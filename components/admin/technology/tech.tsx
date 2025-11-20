// app/(admin)/technologies/page.tsx
"use client";

import * as React from "react";

import Button from "@/components/btn";
import { Technology } from "@/types";
import TechnologyTable from "./tech-table";

import {
  TechnologyCreateModal,
  TechnologyDeleteModal,
} from "@/components/modals/tech-modal";

const MOCK_TECH: Technology[] = [
  { _id: "t1", name: "React", icon: "/icons/react.svg", color: "#61DAFB" },
  { _id: "t2", name: "Next.js", icon: "/icons/nextjs.svg", color: "#FFFFFF" },
  { _id: "t3", name: "Tailwind CSS", icon: "/icons/tw.svg", color: "#06B6D4" },
  {
    _id: "t4",
    name: "Supabase",
    icon: "/icons/supabase.svg",
    color: "#3ECF8E",
  },
  { _id: "t5", name: "GSAP", icon: "/icons/gsap.svg", color: "#88CE02" },
];

export default function TechnologiesAdminPage() {
  const [rows, setRows] = React.useState<Technology[]>(MOCK_TECH);
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
      {/* <ExperienceUpdateModal
              open={open?.edit}
              onClose={() => {
                handleClose("edit");
                setExp(null);
              }}
              onUpdate={() => {}}
              initial={exp}
            /> */}
      <TechnologyCreateModal
        open={open?.create}
        onClose={() => {
          handleClose("create");
          setExp(null);
        }}
        onCreate={() => {}}
      />
      <TechnologyDeleteModal
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
          <h1 className="font-display text-2xl">Technologies</h1>
          <p className="text-dim text-sm">
            Manage technology badges for your projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="goldGradient" onClick={() => handleOpen("create")}>
            + Add Technology
          </Button>
          <Button variant="surface" onClick={() => alert("Import CSV")}>
            Import
          </Button>
        </div>
      </div>

      <TechnologyTable
        data={rows}
        onView={(r) => alert(`View: ${r.name}`)}
        onEdit={(r) => alert(`Edit: ${r.name}`)}
        onDelete={(r) => handleOpen("delete")}
      />
    </div>
  );
}
