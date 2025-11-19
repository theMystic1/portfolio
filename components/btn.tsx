"use client";

import * as React from "react";
import clsx from "clsx";

type Variant =
  | "gold"
  | "goldGradient"
  | "nebula"
  | "amber"
  | "ember"
  | "coral"
  | "aurora"
  | "teal"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "surface"
  | "elevated"
  | "bg";

type Appearance = "solid" | "text" | "ghost" | "outline" | "soft";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  appearance?: Appearance;
  size?: Size;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const SIZE_STYLES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-2",
  md: "h-11 px-4 text-base gap-2.5",
  lg: "h-12 px-5 text-lg gap-3",
};

/** Map variants to base color tokens (Tailwind v4 from your @theme) */
const VCOLOR: Partial<Record<Variant, string>> = {
  gold: "gold-500",
  amber: "amber-600",
  ember: "ember-500",
  coral: "coral-500",
  aurora: "aurora-400",
  teal: "teal-400",
  success: "success-500",
  warning: "warning-500",
  danger: "danger-500",
  info: "info-500",
};

/** SOLID (filled) variants — background matches variant */
const SOLID: Record<Variant, string> = {
  gold: "bg-gold-500 text-[#0e1621] hover:brightness-110 focus-visible:ring-gold-400",
  amber:
    "bg-amber-600 text-[#0e1621] hover:brightness-110 focus-visible:ring-amber-600",
  ember:
    "bg-ember-500 text-white hover:brightness-110 focus-visible:ring-ember-500",
  coral:
    "bg-coral-500 text-white hover:brightness-110 focus-visible:ring-coral-500",
  aurora:
    "bg-aurora-400 text-[#0e1621] hover:brightness-110 focus-visible:ring-aurora-400",
  teal: "bg-teal-400 text-[#0e1621] hover:brightness-110 focus-visible:ring-teal-400",
  success:
    "bg-success-500 text-white hover:brightness-110 focus-visible:ring-success-500",
  warning:
    "bg-warning-500 text-[#0e1621] hover:brightness-110 focus-visible:ring-warning-500",
  danger:
    "bg-danger-500 text-white hover:brightness-110 focus-visible:ring-danger-500",
  info: "bg-info-500 text-[#0e1621] hover:brightness-110 focus-visible:ring-info-500",

  surface:
    "bg-surface text-ink-100 border border-white/10 hover:bg-elevated focus-visible:ring-ink-300",
  elevated:
    "bg-elevated text-ink-100 border border-white/10 hover:brightness-110 focus-visible:ring-ink-300",
  bg: "bg-bg text-ink-100 border border-white/10 hover:bg-surface focus-visible:ring-ink-300",

  goldGradient:
    "bg-gold-gradient text-black hover:brightness-110 focus-visible:ring-amber-600",
  nebula:
    "bg-nebula-gradient text-ink-100 hover:brightness-110 focus-visible:ring-info-500",
};

/** TEXT (link-style) variants — no fill, colored text */
function textClasses(variant: Variant): string {
  if (variant === "goldGradient")
    return "bg-gold-gradient bg-clip-text text-transparent hover:brightness-110 focus-visible:ring-amber-600";
  if (variant === "nebula")
    return "bg-nebula-gradient bg-clip-text text-transparent hover:brightness-110 focus-visible:ring-info-500";

  const c = VCOLOR[variant];
  if (c) {
    return `bg-transparent text-${c} hover:text-${c} focus-visible:ring-${c} hover:opacity-90`;
  }
  // surface/elevated/bg fallbacks
  if (variant === "surface" || variant === "elevated" || variant === "bg") {
    return "bg-transparent text-ink-100 hover:opacity-90 focus-visible:ring-ink-300";
  }
  // default safety
  return "bg-transparent text-ink-100 hover:opacity-90 focus-visible:ring-ink-300";
}

/** SOFT (tinted) variants — subtle bg tint, colored text */
function softClasses(variant: Variant): string {
  const c = VCOLOR[variant];
  if (c) {
    return `bg-${c}/15 text-${c} hover:bg-${c}/25 focus-visible:ring-${c}`;
  }
  if (variant === "goldGradient")
    return "bg-gold-500/15 text-gold-500 hover:bg-gold-500/25 focus-visible:ring-amber-600";
  if (variant === "nebula")
    return "bg-info-500/15 text-info-500 hover:bg-info-500/25 focus-visible:ring-info-500";
  if (variant === "surface" || variant === "elevated" || variant === "bg")
    return "bg-white/5 text-ink-100 hover:bg-white/10 focus-visible:ring-ink-300";
  return "bg-white/5 text-ink-100 hover:bg-white/10 focus-visible:ring-ink-300";
}

/** OUTLINE — 1px border in variant color */
function outlineClasses(variant: Variant): string {
  const c = VCOLOR[variant];
  if (c) {
    return `bg-transparent text-${c} border border-${c} hover:bg-${c}/10 focus-visible:ring-${c}`;
  }
  if (variant === "goldGradient")
    return "bg-transparent text-gold-500 border border-gold-500 hover:bg-gold-500/10 focus-visible:ring-amber-600";
  if (variant === "nebula")
    return "bg-transparent text-info-500 border border-info-500 hover:bg-info-500/10 focus-visible:ring-info-500";
  if (variant === "surface" || variant === "elevated" || variant === "bg")
    return "bg-transparent text-ink-100 border border-white/10 hover:bg-white/5 focus-visible:ring-ink-300";
  return "bg-transparent text-ink-100 border border-white/10 hover:bg-white/5 focus-visible:ring-ink-300";
}

/** GHOST — transparent, subtle hover */
function ghostClasses(variant: Variant): string {
  const c = VCOLOR[variant];
  if (c) {
    return `bg-transparent text-${c} hover:bg-${c}/10 focus-visible:ring-${c}`;
  }
  if (variant === "goldGradient")
    return "bg-transparent text-gold-500 hover:bg-gold-500/10 focus-visible:ring-amber-600";
  if (variant === "nebula")
    return "bg-transparent text-info-500 hover:bg-info-500/10 focus-visible:ring-info-500";
  if (variant === "surface" || variant === "elevated" || variant === "bg")
    return "bg-transparent text-ink-100 hover:bg-white/5 focus-visible:ring-ink-300";
  return "bg-transparent text-ink-100 hover:bg-white/5 focus-visible:ring-ink-300";
}

function variantByAppearance(variant: Variant, appearance: Appearance) {
  switch (appearance) {
    case "solid":
      return SOLID[variant];
    case "text":
      return textClasses(variant);
    case "soft":
      return softClasses(variant);
    case "outline":
      return outlineClasses(variant);
    case "ghost":
      return ghostClasses(variant);
    default:
      return SOLID[variant];
  }
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
      aria-hidden
    />
  );
}

function RootButton(
  {
    className,
    variant = "gold",
    appearance = "solid",
    size = "md",
    isLoading = false,
    leadingIcon,
    trailingIcon,
    children,
    disabled,
    ...props
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex select-none items-center justify-center rounded-xl font-medium transition",
        "active:translate-y-px focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:opacity-50 disabled:pointer-events-none",
        "cursor-pointer",
        SIZE_STYLES[size],
        variantByAppearance(variant, appearance),
        className
      )}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {!isLoading && leadingIcon ? (
        <span className="-ml-0.5">{leadingIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && trailingIcon ? (
        <span className="-mr-0.5">{trailingIcon}</span>
      ) : null}
    </button>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(RootButton);
Button.displayName = "Button";

/* ---- Compound parts ---- */
type ButtonIconProps = React.HTMLAttributes<HTMLSpanElement>;
function ButtonIcon(props: ButtonIconProps) {
  return <span className="inline-flex items-center" {...props} />;
}
ButtonIcon.displayName = "Button.Icon";

type GroupProps = React.HTMLAttributes<HTMLDivElement> & { attached?: boolean };
function ButtonGroup({ className, attached = true, ...props }: GroupProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-stretch",
        attached &&
          "[&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button:not(:first-child,:last-child)]:rounded-none",
        className
      )}
      {...props}
    />
  );
}
ButtonGroup.displayName = "Button.Group";

export default Object.assign(Button, { Icon: ButtonIcon, Group: ButtonGroup });
