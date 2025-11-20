"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import ImagePicker from "@/components/ui/image-picker";
import { validateProject } from "@/lib/validator";

export type ProjectFormValues = {
  title: string;
  description?: string | null;
  technologies: string[];
  features: string[];
  /** accept either a URL string OR a File picked from the ImagePicker */
  coverImage: string | File | null;
};

type ProjectFormProps = {
  projectId?: string;
  initial?: Partial<ProjectFormValues> & { _id?: string };
  onSuccess?: (saved: any) => void;
  labels?: { title?: string; submit?: string };
  submitLabel?: string;
  /** If provided, you handle submit; internal fetch is skipped. */
  onSubmitOverride?: (values: ProjectFormValues) => Promise<void> | void;
};

export default function ProjectForm({
  projectId,
  initial,
  onSuccess,
  labels,
  submitLabel,
  onSubmitOverride,
}: ProjectFormProps) {
  const isEdit = Boolean(projectId || initial?._id);

  const defaults: ProjectFormValues = {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    technologies: initial?.technologies ?? [],
    features: initial?.features ?? [],
    coverImage: initial?.coverImage ?? null, // <-- allow null/File/string
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    setError,
    control, // <-- needed by Controller
    getValues,
  } = useForm<ProjectFormValues>({
    defaultValues: defaults,
    mode: "onBlur",
  });

  const Err = ({ path }: { path: keyof ProjectFormValues | string }) => {
    const segs = String(path).split(".");
    let cur: any = errors;
    for (const s of segs) cur = cur?.[s];
    const msg = (cur as any)?.message as string | undefined;
    return msg ? <p className="text-danger-500 text-xs mt-1">{msg}</p> : null;
  };

  const parseCsv = (v?: string) =>
    (v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  // Optional: upload File to get a URL before saving
  async function uploadIfFile(
    maybeFile: string | File | null
  ): Promise<string | null> {
    if (!maybeFile) return null;
    if (typeof maybeFile === "string") return maybeFile;

    // Example FormData upload to your API route (implement /api/upload)
    const fd = new FormData();
    fd.append("file", maybeFile);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Failed to upload cover image");
    const data = await res.json(); // expect { url: "https://..." }
    return data.url as string;
  }

  const onSubmit = async (values: ProjectFormValues) => {
    // Validate (update your validateProject to allow File|null)
    const { valid, errors: vErrs } = validateProject(values as any);
    if (!valid) {
      Object.entries(vErrs).forEach(([k, msg]) => {
        setError(k as any, { type: "manual", message: String(msg) });
      });
      alert("Please fix the highlighted fields.");
      return;
    }

    // If the coverImage is a File, upload to get URL
    let coverUrl: string | null = null;
    try {
      coverUrl = await uploadIfFile(values.coverImage);
    } catch (e: any) {
      setError("coverImage", {
        type: "manual",
        message: e?.message ?? "Upload failed",
      });
      return;
    }

    const payload = {
      ...values,
      coverImage: coverUrl, // backend expects a URL string
    };

    if (onSubmitOverride) {
      await onSubmitOverride(payload as ProjectFormValues);
      return;
    }

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `/api/projects/${projectId ?? initial?._id}`
      : `/api/projects`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data?.message ?? "Failed to save project");
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
            {labels?.title ?? (isEdit ? "Edit Project" : "Create Project")}
          </h2>
          <p className="text-dim text-sm">
            {isEdit ? "Update project details." : "Add a new project entry."}
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

      {/* Card */}
      <div className="card">
        <h3 className="font-display text-lg mb-3">Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-300">Title</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("title", { required: "Title is required." })}
            />
            <Err path="title" />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Cover image</label>
            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <ImagePicker
                  label=""
                  aspect="wide"
                  value={field.value} // File | string | null
                  onChange={(v) => field.onChange(v)}
                  onError={(m) => alert(m)}
                />
              )}
            />
            <Err path="coverImage" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-ink-300">Description</label>
            <textarea
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              rows={3}
              {...register("description")}
            />
          </div>

          <div>
            <label className="block text-sm text-ink-300">
              Technologies (comma-separated)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              onBlur={(e) => setValue("technologies", parseCsv(e.target.value))}
              placeholder="react, next.js, node"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-300">
              Features (comma-separated)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              onBlur={(e) => setValue("features", parseCsv(e.target.value))}
              placeholder="auth, dashboard, charts"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
