"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { validateExperience } from "@/lib/validator";
import Modal from "../ui/modal";

/** --------- Types (inline to avoid external deps) --------- */
export type ProjectItem = {
  title: string;
  description?: string | null;
  technologies: string[];
  features: string[];
};

export type ExperienceFormValues = {
  role: string;
  company: {
    name: string;
    jobLocation?: string | null;
    jobType?: string | null; // ONSITE | REMOTE | HYBRID
  };
  projects: ProjectItem[];
  startDate: string; // yyyy-mm-dd
  endDate?: string; // yyyy-mm-dd | ""
  isCurrent: boolean;
};

type ExperienceFormProps = {
  /** when provided we do PUT /api/experience/:id (unless onSubmitOverride is passed) */
  experienceId?: string;
  /** initial data for edit mode */
  initial?: Partial<ExperienceFormValues> & { _id?: string };
  /** called after successful internal save (when onSubmitOverride isn't used) */
  onSuccess?: (saved: any) => void;
  /** UI labels */
  labels?: { title?: string; submit?: string };
  /** override the submit label (takes precedence over labels.submit) */
  submitLabel?: string;
  /** if provided, *you* handle submit (used by modals); internal fetch is skipped */
  onSubmitOverride?: (values: ExperienceFormValues) => Promise<void> | void;
};

export default function ExperienceForm({
  experienceId,
  initial,
  onSuccess,
  labels,
  submitLabel,
  onSubmitOverride,
}: ExperienceFormProps) {
  const isEdit = Boolean(experienceId || initial?._id);

  // sensible defaults
  const defaults: ExperienceFormValues = {
    role: initial?.role ?? "",
    company: {
      name: initial?.company?.name ?? "",
      jobLocation: initial?.company?.jobLocation ?? "",
      jobType: initial?.company?.jobType ?? "",
    },
    projects: (initial?.projects as ProjectItem[]) ?? [],
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    isCurrent: Boolean(initial?.isCurrent ?? false),
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
    setValue,
    getValues,
    reset,
    setError,
  } = useForm<ExperienceFormValues>({
    defaultValues: defaults,
    mode: "onBlur",
  });

  const isCurrent = watch("isCurrent");

  // Projects array
  const { fields, append, remove } = useFieldArray({
    name: "projects",
    control,
  });

  // If isCurrent => clear endDate
  React.useEffect(() => {
    if (isCurrent) setValue("endDate", "");
  }, [isCurrent, setValue]);

  // Error helper (nested-safe)
  const Err = ({ path }: { path: string }) => {
    const parts = path.split(".");
    let cur: any = errors;
    for (const p of parts) {
      cur = cur?.[p as keyof typeof cur];
      if (!cur) break;
    }
    const msg = (cur as any)?.message as string | undefined;
    return msg ? <p className="text-danger-500 text-xs mt-1">{msg}</p> : null;
  };

  // CSV helper
  const parseCsv = (v?: string) =>
    (v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  // Submit
  const onSubmit = async (values: ExperienceFormValues) => {
    // Plain TypeScript validation (no zod)
    const { valid, errors: vErrs } = validateExperience(values);
    if (!valid) {
      // Optionally map field errors into RHF
      Object.entries(vErrs).forEach(([k, msg]) => {
        // try to set on a top-level field
        setError(k as any, { type: "manual", message: String(msg) });
      });
      alert("Please fix the highlighted fields.");
      return;
    }

    // If caller wants to handle persistence (modals), use override
    if (onSubmitOverride) {
      await onSubmitOverride(values);
      return;
    }

    // Default internal persistence
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `/api/experience/${experienceId ?? initial?._id}`
      : `/api/experience`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data?.message ?? "Failed to save experience");
      return;
    }

    onSuccess?.(data?.data ?? data);
    if (!isEdit) reset(defaults);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl">
            {labels?.title ??
              (isEdit ? "Edit Experience" : "Create Experience")}
          </h2>
          <p className="text-dim text-sm">
            {isEdit
              ? "Update this role and attached projects."
              : "Add a role, dates, and any projects you worked on."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => reset(defaults)}
            className="btn btn-ghost"
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {submitLabel ?? labels?.submit ?? (isEdit ? "Update" : "Create")}
          </button>
        </div>
      </div>

      {/* Basics */}
      <div className="card">
        <h3 className="font-display text-lg mb-3">Basics</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-300">Role</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("role", {
                required: "Role is required.",
                minLength: {
                  value: 3,
                  message: "Role should be 3–100 characters.",
                },
                maxLength: {
                  value: 100,
                  message: "Role should be 3–100 characters.",
                },
              })}
            />
            <Err path="role" />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Company Name</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("company.name", {
                required: "Company name is required.",
                minLength: {
                  value: 3,
                  message: "Company name should be 3–100 characters.",
                },
                maxLength: {
                  value: 100,
                  message: "Company name should be 3–100 characters.",
                },
              })}
            />
            <Err path="company.name" />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Job Location</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("company.jobLocation")}
            />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Job Type</label>
            <select
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("company.jobType")}
            >
              <option value="">Select…</option>
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="card">
        <h3 className="font-display text-lg mb-3">Dates</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-ink-300">Start date</label>
            <input
              type="date"
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("startDate", {
                required: "Start date is required.",
                validate: (v) =>
                  !isNaN(new Date(v).getTime()) || "Enter a valid date.",
              })}
            />
            <Err path="startDate" />
          </div>

          <div>
            <label className="block text-sm text-ink-300">End date</label>
            <input
              type="date"
              disabled={isCurrent}
              className="w-full rounded-lg bg-surface border border-white/10 p-2 disabled:opacity-50"
              {...register("endDate", {
                validate: (end) => {
                  const isCurr = getValues("isCurrent");
                  if (isCurr && end) {
                    return 'End date must be empty when "Current role" is selected.';
                  }
                  if (end) {
                    const start = new Date(getValues("startDate"));
                    const e = new Date(end);
                    if (
                      !isNaN(start.getTime()) &&
                      !isNaN(e.getTime()) &&
                      e < start
                    ) {
                      return "End date cannot be before start date.";
                    }
                  }
                  return true;
                },
              })}
            />
            <Err path="endDate" />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isCurrent")} />
              Current role
            </label>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg">Projects</h3>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              append({
                title: "",
                description: "",
                technologies: [],
                features: [],
              })
            }
          >
            + Add Project
          </button>
        </div>

        <div className="space-y-6">
          {fields.length === 0 && (
            <p className="text-sm text-muted">No projects added yet.</p>
          )}

          {fields.map((f, i) => (
            <div
              key={f.id}
              className="rounded-xl border border-white/10 p-4 bg-surface/70"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ink-300">
                    Project title
                  </label>
                  <input
                    className="w-full rounded-lg bg-surface border border-white/10 p-2"
                    {...register(`projects.${i}.title` as const, {
                      required: "Please provide a project title.",
                    })}
                  />
                  <Err path={`projects.${i}.title`} />
                </div>

                <div>
                  <label className="block text-sm text-ink-300">
                    Description
                  </label>
                  <input
                    className="w-full rounded-lg bg-surface border border-white/10 p-2"
                    {...register(`projects.${i}.description` as const)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink-300">
                    Technologies (comma-separated)
                  </label>
                  <textarea
                    className="w-full rounded-lg bg-surface border border-white/10 p-2"
                    onBlur={(e) =>
                      setValue(
                        `projects.${i}.technologies`,
                        parseCsv(e.target.value)
                      )
                    }
                    placeholder="react, next.js, node"
                    rows={4}
                    cols={4}
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink-300">
                    Features (comma-separated)
                  </label>
                  <textarea
                    className="w-full rounded-lg bg-surface border border-white/10 p-2"
                    onBlur={(e) =>
                      setValue(
                        `projects.${i}.features`,
                        parseCsv(e.target.value)
                      )
                    }
                    placeholder="auth, dashboard, charts"
                    rows={4}
                    cols={4}
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="text-sm text-danger-500 hover:underline"
                  onClick={() => remove(i)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

export function ExperienceCreateModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (v: ExperienceFormValues) => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Create Experience"
      description="Add a new role and (optionally) projects."
    >
      <ExperienceForm
        submitLabel="Create"
        onSubmitOverride={async (v) => {
          await onCreate(v);
          onClose();
        }}
      />
    </Modal>
  );
}

export function ExperienceUpdateModal({
  open,
  onClose,
  initial,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  initial: ExperienceFormValues & { _id?: string };
  onUpdate: (v: ExperienceFormValues) => Promise<void> | void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg" title="Update Experience">
      <ExperienceForm
        initial={initial}
        submitLabel="Update"
        onSubmitOverride={async (v) => {
          await onUpdate(v);
          onClose();
        }}
      />
    </Modal>
  );
}

export function ExperienceDeleteModal({
  open,
  onClose,
  label,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  onDelete: () => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Delete Experience?"
      description={`This will permanently remove "${label}". You can’t undo this.`}
      className=""
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
