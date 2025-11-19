"use client";

import * as React from "react";
import Modal from "@/components/ui/modal";
import { ProjectFormValues } from "@/types";
import ProjectForm from "../admin/projects/form";

export function ProjectCreateModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (v: ProjectFormValues) => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Create Project"
      description="Add a new project."
    >
      <ProjectForm
        submitLabel="Create"
        onSubmitOverride={async (v) => {
          await onCreate(v);
          onClose();
        }}
      />
    </Modal>
  );
}

export function ProjectDeleteModal({
  open,
  onClose,
  label,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  label: string; // project title
  onDelete: () => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Delete Project?"
      description={`This will permanently remove "${label}". You can’t undo this.`}
      footer={
        <>
          <button onClick={onClose} className="btn btn-ghost rounded-lg">
            Cancel
          </button>
          <button
            onClick={async () => {
              await onDelete();
              onClose();
            }}
            className="btn rounded-lg bg-danger-500 text-white hover:brightness-110"
          >
            Delete
          </button>
        </>
      }
    />
  );
}
