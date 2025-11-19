// app/(admin)/projects/page.tsx
"use client";

import * as React from "react";

import Button from "@/components/btn";
import { Project } from "@/types";
import ProjectTable from "./project-table";

const MOCK_PROJECTS: Project[] = [
  {
    _id: "p1",
    title: "Portfolio Platform",
    description: "Next.js + Tailwind + GSAP animated portfolio.",
    technologies: ["Next.js", "TypeScript", "Tailwind", "GSAP"],
    features: ["Animated Hero", "Admin CMS", "Starfield"],
    coverImage: "/images/portfolio-cover.jpg",
    createdAt: "2024-08-01",
  },
  {
    _id: "p2",
    title: "Service Marketplace",
    description: "React Native + Supabase with chat & bookings.",
    technologies: ["React Native", "Expo", "Supabase"],
    features: ["Auth", "Bookings", "Chat"],
    coverImage: "/images/marketplace.jpg",
    updatedAt: "2024-10-10",
  },
  {
    _id: "p3",
    title: "Analytics Dashboard",
    description: "Role-based admin with audit trail & charts.",
    technologies: ["Next.js", "Node", "Postgres"],
    features: ["RBAC", "Audit Trail", "Charts"],
    coverImage: "/images/admin-analytics.jpg",
    updatedAt: "2024-11-05",
  },
];

export default function ProjectsAdminPage() {
  const [rows, setRows] = React.useState<Project[]>(MOCK_PROJECTS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">Projects</h1>
          <p className="text-dim text-sm">
            Manage portfolio projects and tech stacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="goldGradient"
            onClick={() => alert("Open create project drawer")}
          >
            + Add Project
          </Button>
          <Button variant="surface" onClick={() => alert("Import CSV")}>
            Import
          </Button>
        </div>
      </div>

      <ProjectTable
        data={rows}
        onView={(r) => alert(`View: ${r.title}`)}
        onEdit={(r) => alert(`Edit: ${r.title}`)}
        onDelete={(r) =>
          setRows((all) => all.filter((x) => (x._id ?? "") !== (r._id ?? "")))
        }
      />
    </div>
  );
}
