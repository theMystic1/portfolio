"use client";

import * as React from "react";
import clsx from "clsx";
import { FiUpload, FiTrash2, FiImage } from "react-icons/fi";

/** ---------- Types ---------- */

type BaseProps = {
  label?: string;
  helpText?: string;
  className?: string;
  disabled?: boolean;
  /** e.g. ["image/png","image/jpeg","image/webp"] (defaults below) */
  accept?: string[];
  /** Max single file size in MB (default 5) */
  maxSizeMB?: number;
  /** Visual hint only (adds aspect classes) or a number ratio (w/h) */
  aspect?: "square" | "wide" | "tall" | number;
  /** Handle validation or other messages */
  onError?: (msg: string) => void;
  /** Tab-index override for dropzone (defaults 0) */
  tabIndex?: number;
};

type SingleProps = BaseProps & {
  mode?: "single";
  value?: File | string | null;
  onChange: (val: File | string | null) => void;
};

type MultiProps = BaseProps & {
  mode: "multiple";
  value?: Array<File | string>;
  onChange: (val: Array<File | string>) => void;
  maxCount?: number; // default unlimited
};

type ImagePickerProps = SingleProps | MultiProps;

/** ---------- Utilities ---------- */

const DEFAULT_ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MB = 1024 * 1024;

function asObjectUrl(x: File | string): string {
  return typeof x === "string" ? x : URL.createObjectURL(x);
}

/** revoke all created object URLs on unmount or value change */
function useObjectUrls(values: Array<File | string> | (File | string | null)) {
  const urlsRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    // clear any previous
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = [];

    const arr = Array.isArray(values) ? values : values ? [values] : [];
    for (const v of arr) {
      if (v instanceof File) {
        const u = URL.createObjectURL(v);
        urlsRef.current.push(u);
      }
    }
    return () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlsRef.current = [];
    };
  }, [values]);
}

/** validate files, returns accepted + errors (by message) */
function validateFiles(
  files: FileList | File[],
  {
    accept = DEFAULT_ACCEPT,
    maxSizeMB = 5,
  }: { accept?: string[]; maxSizeMB?: number }
) {
  const accepted: File[] = [];
  const errors: string[] = [];

  const outOfLimit = (f: File) => f.size > maxSizeMB * MB;
  const notAccepted = (f: File) =>
    !accept.some(
      (t) =>
        f.type === t || (t.startsWith("image/") && f.type.startsWith("image/"))
    );

  Array.from(files).forEach((f) => {
    if (outOfLimit(f)) {
      errors.push(`"${f.name}" is larger than ${maxSizeMB}MB.`);
    } else if (notAccepted(f)) {
      errors.push(`"${f.name}" is not an accepted image type.`);
    } else {
      accepted.push(f);
    }
  });

  return { accepted, errors };
}

/** classes for aspect hint */
function aspectClass(aspect?: ImagePickerProps["aspect"]) {
  if (typeof aspect === "number") {
    // ratio like 16/9 => use inline style; here we just default to a rounded container
    return "aspect-[var(--ratio)]";
  }
  switch (aspect) {
    case "square":
      return "aspect-square";
    case "wide":
      return "aspect-video"; // ~16/9
    case "tall":
      return "aspect-[3/4]";
    default:
      return ""; // free size
  }
}

/** ---------- Component ---------- */

export default function ImagePicker(props: ImagePickerProps) {
  const {
    label,
    helpText,
    className,
    disabled,
    accept = DEFAULT_ACCEPT,
    maxSizeMB = 5,
    aspect,
    onError,
    tabIndex = 0,
  } = props;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dropRef = React.useRef<HTMLDivElement | null>(null);

  const isMultiple = props.mode === "multiple";
  const value = isMultiple ? props.value ?? [] : props.value ?? null;

  // manage object URLs to prevent leaks
  useObjectUrls(value as any);

  // derived display urls (Files → blob url; strings unchanged)
  const urls = React.useMemo(() => {
    if (isMultiple) {
      return (value as Array<File | string>).map((v) => asObjectUrl(v));
    }
    return value ? [asObjectUrl(value as File | string)] : [];
  }, [isMultiple, value]);

  const fireError = (msg: string) => onError?.(msg);

  const handleFiles = (files: FileList | File[]) => {
    const { accepted, errors } = validateFiles(files, { accept, maxSizeMB });
    if (errors.length) {
      fireError(errors.join("\n"));
    }
    if (!accepted.length) return;

    if (isMultiple) {
      const maxCount = (props as MultiProps).maxCount;
      const current = (value as Array<File | string>) ?? [];
      const next = maxCount
        ? [...current, ...accepted].slice(0, maxCount)
        : [...current, ...accepted];
      (props as MultiProps).onChange(next);
    } else {
      (props as SingleProps).onChange(accepted[0]);
    }
  };

  const onBrowse = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer?.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onPaste = React.useCallback(
    (e: ClipboardEvent) => {
      if (disabled) return;
      if (!dropRef.current) return;
      const active = document.activeElement;
      // only paste into this zone (focus must be inside)
      if (active && dropRef.current.contains(active as Node)) {
        const items = e.clipboardData?.items || [];
        const files: File[] = [];
        for (const it of items as any) {
          if (it.kind === "file") {
            const f = it.getAsFile?.();
            if (f) files.push(f);
          }
        }
        if (files.length) {
          e.preventDefault();
          handleFiles(files);
        }
      }
    },
    [disabled]
  );

  React.useEffect(() => {
    window.addEventListener("paste", onPaste as any);
    return () => window.removeEventListener("paste", onPaste as any);
  }, [onPaste]);

  // remove one
  const removeAt = (idx: number) => {
    if (!isMultiple) {
      (props as SingleProps).onChange(null);
      return;
    }
    const arr = [...((value as Array<File | string>) ?? [])];
    arr.splice(idx, 1);
    (props as MultiProps).onChange(arr);
  };

  // keyboard open
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onBrowse();
    }
  };

  // style hints
  const aspectCls = aspectClass(aspect);
  const ratioStyle =
    typeof aspect === "number"
      ? ({ ["--ratio" as any]: aspect } as React.CSSProperties)
      : undefined;

  return (
    <div className={clsx("w-full", className)}>
      {label ? (
        <label className="mb-2 block font-medium text-ink-100">{label}</label>
      ) : null}

      {/* Drop zone */}
      <div
        ref={dropRef}
        role="button"
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        onClick={onBrowse}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        aria-disabled={disabled}
        className={clsx(
          "group relative rounded-2xl border border-white/10 bg-surface/60",
          "transition hover:border-white/20 focus:outline-none",
          "p-4 md:p-6",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          multiple={isMultiple}
          className="hidden"
          onChange={(e) =>
            e.currentTarget.files && handleFiles(e.currentTarget.files)
          }
        />

        {/* Empty state */}
        {urls.length === 0 ? (
          <div
            className={clsx(
              "flex flex-col items-center justify-center gap-2 rounded-xl",
              "border border-dashed border-white/10 bg-surface/50 p-6",
              aspectCls || "min-h-40",
              "transition group-hover:border-white/20"
            )}
            style={ratioStyle}
          >
            <div className="rounded-full bg-white/5 p-3">
              <FiUpload className="h-6 w-6 text-ink-100" />
            </div>
            <p className="text-sm text-ink-300 text-center">
              <span className="text-ink-100">Click to browse</span> or{" "}
              <span className="text-ink-100">drag & drop</span>
              <br />
              You can also <span className="text-ink-100">paste</span> an image
              here.
            </p>
            {helpText ? <p className="text-xs text-muted">{helpText}</p> : null}
            <p className="text-xs text-muted">
              Accepted: {accept.map((t) => t.split("/")[1] || t).join(", ")} •
              Max {maxSizeMB}MB
            </p>
          </div>
        ) : null}

        {/* Thumbnails */}
        {urls.length > 0 ? (
          <div
            className={clsx(
              isMultiple
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                : ""
            )}
          >
            {urls.map((src, idx) => (
              <figure
                key={idx}
                className={clsx(
                  "relative overflow-hidden rounded-xl border border-white/10 bg-black/20",
                  "transition hover:border-white/20",
                  isMultiple ? "aspect-square" : aspectCls || "aspect-video"
                )}
                style={ratioStyle}
              >
                {/* img */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Selected"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // fallback
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                {/* fallback icon */}
                <div className="absolute inset-0 hidden items-center justify-center text-ink-300">
                  <FiImage className="h-8 w-8" />
                </div>

                {/* toolbar */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(idx);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-xs text-ink-100 hover:bg-black/60"
                    aria-label="Remove image"
                    title="Remove"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Remove
                  </button>

                  {/* Replace only for single mode */}
                  {!isMultiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBrowse();
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-ink-100 hover:bg-white/15"
                      aria-label="Replace image"
                      title="Replace"
                    >
                      Replace
                    </button>
                  )}
                </div>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
