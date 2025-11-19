"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { validateTechnology } from "@/lib/validator";

export type TechnologyFormValues = {
  name: string;
  icon?: string | null;
  color?: string | null;
};

type TechnologyFormProps = {
  technologyId?: string;
  initial?: Partial<TechnologyFormValues> & { _id?: string };
  onSuccess?: (saved: any) => void;
  labels?: { title?: string; submit?: string };
  submitLabel?: string;
  onSubmitOverride?: (values: TechnologyFormValues) => Promise<void> | void;
};

export default function TechnologyForm({
  technologyId,
  initial,
  onSuccess,
  labels,
  submitLabel,
  onSubmitOverride,
}: TechnologyFormProps) {
  const isEdit = Boolean(technologyId || initial?._id);

  const defaults: TechnologyFormValues = {
    name: initial?.name ?? "",
    icon: initial?.icon ?? "",
    color: initial?.color ?? "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TechnologyFormValues>({
    defaultValues: defaults,
    mode: "onBlur",
  });

  const Err = ({ path }: { path: keyof TechnologyFormValues }) => {
    const msg = (errors[path]?.message as string) || "";
    return msg ? <p className="text-danger-500 text-xs mt-1">{msg}</p> : null;
  };

  const onSubmit = async (values: TechnologyFormValues) => {
    const { valid, errors: vErrs } = validateTechnology(values);
    if (!valid) {
      Object.entries(vErrs).forEach(([k, msg]) => {
        setError(k as any, { type: "manual", message: String(msg) });
      });
      alert("Please fix the highlighted fields.");
      return;
    }

    if (onSubmitOverride) {
      await onSubmitOverride(values);
      return;
    }

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `/api/technologies/${technologyId ?? initial?._id}`
      : `/api/technologies`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data?.message ?? "Failed to save technology");
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
              (isEdit ? "Edit Technology" : "Create Technology")}
          </h2>
          <p className="text-dim text-sm">
            {isEdit ? "Update this technology." : "Add a new technology."}
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
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm text-ink-300">Name</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("name", {
                required: "Technology name is required.",
                minLength: { value: 3, message: "Minimum 3 characters." },
                maxLength: { value: 50, message: "Maximum 50 characters." },
              })}
            />
            <Err path="name" />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Icon URL</label>
            <input
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("icon")}
              placeholder="https://…"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-300">Color</label>
            <input
              type="text"
              className="w-full rounded-lg bg-surface border border-white/10 p-2"
              {...register("color")}
              placeholder="#61dafb or brand token"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
