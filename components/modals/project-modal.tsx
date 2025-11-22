// components/admin/projects/project-modals.tsx
"use client";

import * as React from "react";
import Modal from "@/components/ui/modal";
// import ProjectForm, { ProjectFormValues } from "./project-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProjectForm, { ProjectFormValues } from "../admin/projects/form";
import { deleteProject } from "@/backend/lib/apii";

export function ProjectCreateModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (saved: any) => void;
}) {
  const router = useRouter();

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Create Project"
      description="Add a new project with cover image, technologies and features."
    >
      <ProjectForm
        onSubmitOverride={(saved) => {
          // onCreated?.(saved);
          onClose();
          // router.refresh();
        }}
      />
    </Modal>
  );
}

export function ProjectUpdateModal({
  open,
  onClose,
  projectId,
  initial,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
  initial: Partial<ProjectFormValues> & { _id?: string };
  onUpdated?: (saved: any) => void;
}) {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose} size="lg" title="Update Project">
      <ProjectForm
        projectId={projectId}
        initial={initial}
        onSubmitOverride={(saved) => {
          // onUpdated?.(saved);
          onClose();
          // router.refresh();
        }}
      />
    </Modal>
  );
}

export function ProjectDeleteModal({
  open,
  onClose,
  projectId,
  label,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
  label?: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function handleDelete() {
    toast.loading("Deleting project...");
    try {
      setBusy(true);
      const res = await deleteProject(projectId!);
      toast.remove();

      toast.success(res?.message ?? "Project deleted");
      onDeleted?.();
      onClose();
      router.refresh();
    } catch (e: any) {
      toast.remove();
      toast.error(e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Delete Project?"
      description={`This will permanently remove ${
        label ? `"${label}"` : "this project"
      }.`}
      footer={
        <>
          <button onClick={onClose} className="btn btn-ghost rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="btn rounded-lg bg-danger-500 text-white hover:brightness-110"
          >
            {busy ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    />
  );
}
