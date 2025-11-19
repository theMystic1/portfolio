"use client";
import * as React from "react";
import clsx from "clsx";

export function Field({
  label,
  children,
  error,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      {label ? (
        <span className="mb-1 block text-sm text-ink-300">{label}</span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-danger-500">{error}</span>
      ) : null}
    </label>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={clsx(
      "w-full rounded-lg bg-elevated border border-white/10 px-3 py-2 text-sm outline-none",
      "placeholder:text-ink-500 focus:ring-2 ring-info-500 focus:border-white/20",
      props.className
    )}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={clsx(
      "w-full rounded-lg bg-elevated border border-white/10 px-3 py-2 text-sm outline-none",
      "placeholder:text-ink-500 focus:ring-2 ring-info-500 focus:border-white/20",
      props.className
    )}
  />
));
Textarea.displayName = "Textarea";

/** Simple chip input for string[] fields (technologies, features) */
export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = React.useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className="rounded-lg bg-elevated border border-white/10 p-2">
      <div className="flex flex-wrap gap-1 mb-2">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-md bg-white/5 px-2 py-1 text-xs"
          >
            {t}
            <button
              onClick={() => onChange(value.filter((x) => x !== t))}
              className="text-ink-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) =>
            e.key === "Enter" ? (e.preventDefault(), add()) : undefined
          }
        />
        <button
          onClick={add}
          className="btn btn-primary text-xs px-3 py-2 rounded-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
}
