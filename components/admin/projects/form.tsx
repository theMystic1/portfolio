// components/admin/projects/project-form.tsx
"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import ImagePicker from "@/components/ui/image-picker";
import { validateProject } from "@/lib/validator";
import { uploadToCloudinary } from "@/backend/lib/helpers"; // must return { secure_url | secureUrl | url }
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/backend/lib/apii";

export type ProjectFormValues = {
  title: string;
  description?: string | null;
  technologies: string[];
  features: string[];
  coverImage: string | File | null;
  githubUrl?: string;
  liveUrl?: string;
};

type ProjectFormProps = {
  projectId?: string;
  initial?: Partial<ProjectFormValues> & { _id?: string };
  onSuccess?: (saved: any) => void;
  labels?: { title?: string; submit?: string };
  submitLabel?: string;
  onSubmitOverride?: (values: ProjectFormValues) => Promise<void> | void; // optional
};

export default function ProjectForm({
  projectId,
  initial,
  onSuccess,
  labels,
  submitLabel,
  onSubmitOverride,
}: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(projectId || initial?._id);

  const defaults: ProjectFormValues = {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    technologies: initial?.technologies ?? [],
    features: initial?.features ?? [],
    coverImage: initial?.coverImage ?? null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    setError,
    control,
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

  async function ensureCoverUrl(ci: string | File | null) {
    if (!ci) return "";
    if (typeof ci === "string") return ci;
    const up = await uploadToCloudinary(ci);
    const url = up?.secure_url || up?.secureUrl || up?.url;
    if (!url) throw new Error("Upload failed — no URL returned.");
    return url;
  }

  const onSubmit = async (values: ProjectFormValues) => {
    // Client validation
    const { valid, errors: vErrs } = validateProject(values as any);
    if (!valid) {
      Object.entries(vErrs).forEach(([k, msg]) => {
        setError(k as any, { type: "manual", message: String(msg) });
      });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (!values?.coverImage) {
      setError("coverImage", {
        type: "manual",
        message: "Please select an Image",
      });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    toast.loading(isEdit ? "updating project..." : "creating project...");
    try {
      // Only upload if a new File was selected
      const coverImage = await ensureCoverUrl(values.coverImage);

      const payload = {
        ...values,
        coverImage, // backend expects a string URL
      };
      let res;
      if (isEdit) {
        res = await updateProject(projectId!, payload);
      } else {
        res = await createProject(payload);
      }

      console.log(res);

      toast.remove();
      toast.success(isEdit ? "Project updated" : "Project created");
      // onSuccess?.(data?.data ?? data);
      router.refresh();
      onSubmitOverride?.(values);
      if (!isEdit) reset(defaults);
    } catch (e: any) {
      toast.remove();
      toast.error(e?.message || "Save failed");
      setError("coverImage", { type: "manual", message: e?.message });
    }
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
                  onError={(m) => toast.error(m)}
                />
              )}
            />
            <Err path="coverImage" />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Github Url</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("githubUrl")}
            />
            <Err path="githubUrl" />
          </div>
          <div>
            <label className="block text-sm text-ink-300">Live Link</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("liveUrl")}
            />
            <Err path="liveUrl" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-ink-300">Description</label>
            <textarea
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              rows={3}
              {...register("description", {
                required: "Description is required.",
              })}
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
              defaultValue={initial?.technologies?.join(", ")}
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
              defaultValue={initial?.features?.join(", ")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
