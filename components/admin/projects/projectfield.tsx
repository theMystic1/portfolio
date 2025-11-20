// components/admin/projects/ProjectCoverField.tsx
"use client";
import ImagePicker from "@/components/ui/image-picker";
import * as React from "react";

export default function ProjectCoverField({
  value,
  onChange,
}: {
  value?: File | string | null;
  onChange: (v: File | string | null) => void;
}) {
  return (
    <ImagePicker
      label="Cover image"
      helpText="Recommended 16:9 cover (JPG/PNG/WebP)"
      aspect="wide"
      value={value ?? null}
      onChange={onChange}
      maxSizeMB={8}
      accept={["image/jpeg", "image/png", "image/webp"]}
      onError={(m) => alert(m)}
      className="mt-2"
    />
  );
}
