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
import toast from "react-hot-toast";
import { createBulkExperience } from "@/backend/lib/apii";
import { experienceSeed } from "@/backend/lib/constants";
import { useRouter } from "next/navigation";

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

export default function ExperienceAdminPage({ exps }: { exps: any[] }) {
  const [rows, setRows] = React.useState<Experience[]>(MOCK);
  const [open, setOpen] = React.useState({
    edit: false,
    create: false,
    delete: false,
  });

  const [exp, setExp] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  // console.log(exps);

  const handleOpen = (type: "edit" | "create" | "delete") =>
    setOpen((prv) => ({ ...prv, [type]: true }));
  const handleClose = (type: "edit" | "create" | "delete") =>
    setOpen((prv) => ({ ...prv, [type]: false }));

  const handleSeedExperiences = async () => {
    try {
      setLoading(true);
      toast.loading("Seeding experience....");

      const res = await createBulkExperience(experienceSeed);

      toast.remove();
      toast.success(res?.message ?? "Seeding completed");

      router?.refresh();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ?? "Experience seeding failed";
      console.error(error);
      toast.remove();
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

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
        loading={loading}
        setLoading={setLoading}
      />
      <ExperienceCreateModal
        open={open?.create}
        onClose={() => {
          handleClose("create");
          setExp(null);
        }}
        onCreate={() => {}}
        loading={loading}
        setLoading={setLoading}
      />
      <ExperienceDeleteModal
        open={open?.delete}
        onClose={() => {
          handleClose("delete");
          setExp(null);
        }}
        onDelete={() => {}}
        label="Delete"
        expId={exp?._id}
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
          <Button
            variant="surface"
            onClick={handleSeedExperiences}
            disabled={loading}
          >
            {loading ? "Seeding..." : " Seed experience data"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <ExperienceTable
        data={exps}
        onView={(r) => alert(`View: ${r.role}`)}
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
