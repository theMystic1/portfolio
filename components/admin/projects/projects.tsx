// app/(admin)/projects/page.tsx
"use client";

import * as React from "react";

import Button from "@/components/btn";
import { Project } from "@/types";
import ProjectTable from "./project-table";
import {
  ProjectCreateModal,
  ProjectDeleteModal,
  ProjectUpdateModal,
} from "@/components/modals/project-modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createBulkProject } from "@/backend/lib/apii";
import { projectSeed } from "@/backend/lib/constants";

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

export default function ProjectsAdminPage({ projects }: { projects: any }) {
  const [rows, setRows] = React.useState<Project[]>(MOCK_PROJECTS);
  const [open, setOpen] = React.useState({
    edit: false,
    create: false,
    delete: false,
  });

  const [exp, setExp] = React.useState<any>();
  // console.log(projects);

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const handleSeedExperiences = async () => {
    try {
      setLoading(true);
      toast.loading("Seeding projects....");

      const res = await createBulkProject(projectSeed);

      toast.remove();
      toast.success(res?.message ?? "Seeding completed");

      router?.refresh();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ?? "projects seeding failed";
      console.error(error);
      toast.remove();
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (type: "edit" | "create" | "delete") =>
    setOpen((prv) => ({ ...prv, [type]: true }));
  const handleClose = (type: "edit" | "create" | "delete") =>
    setOpen((prv) => ({ ...prv, [type]: false }));

  return (
    <div className="space-y-6">
      <ProjectUpdateModal
        open={open?.edit}
        onClose={() => {
          handleClose("edit");
          setExp(null);
        }}
        // onUpdate={() => {}}
        initial={exp}
        projectId={exp?._id}
      />
      <ProjectCreateModal
        open={open?.create}
        onClose={() => {
          handleClose("create");
          setExp(null);
        }}
        // onCreate={() => {}}
      />
      <ProjectDeleteModal
        open={open?.delete}
        onClose={() => {
          handleClose("delete");
          setExp(null);
        }}
        // onDelete={() => {}}
        projectId={exp?._id}
        label="Delete"
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">Projects</h1>
          <p className="text-dim text-sm">
            Manage portfolio projects and tech stacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="goldGradient" onClick={() => handleOpen("create")}>
            + Add Project
          </Button>
          <Button variant="surface" onClick={handleSeedExperiences}>
            {loading ? "Seeding projects...." : "Seed projects"}
          </Button>
        </div>
      </div>

      <ProjectTable
        data={projects}
        onView={(r) => {
          handleOpen("delete");
          setExp(r);
        }}
        onEdit={(r) => {
          handleOpen("edit");
          setExp(r);
        }}
        onDelete={(r) => {
          handleOpen("delete");
          setExp(r);
        }}
      />
    </div>
  );
}
