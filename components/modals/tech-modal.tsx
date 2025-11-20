"use client";

import * as React from "react";
import Modal from "@/components/ui/modal";
import TechnologyForm, {
  TechnologyFormValues,
} from "../admin/technology/tech-form";

export function TechnologyCreateModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (v: TechnologyFormValues) => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Create Technology"
      description="Add a new technology."
    >
      <TechnologyForm
        submitLabel="Create"
        onSubmitOverride={async (v) => {
          await onCreate(v);
          onClose();
        }}
      />
    </Modal>
  );
}

export function TechnologyDeleteModal({
  open,
  onClose,
  label,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  label: string; // technology name
  onDelete: () => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Delete Technology?"
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
