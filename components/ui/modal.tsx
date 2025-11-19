"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: ModalSize;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const SIZES: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => setMounted(true), []);

  // lock scroll when open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // ESC to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // focus first interactive element
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
        ?.focus();
    }, 10);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-70 flex items-start justify-center p-4 md:p-6"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          role="dialog"
          aria-modal="true"
        >
          {/* scrim */}
          <motion.button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* panel */}
          <motion.div
            ref={panelRef}
            className={clsx(
              "relative w-full rounded-2xl border border-white/10 bg-surface text-ink-100 shadow-gold max-h-[700px] overflow-auto no-scrollbar",
              "focus:outline-none",
              SIZES[size],
              className
            )}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 380, damping: 28 },
            }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
          >
            {/* header */}
            {(title || description) && (
              <div className="px-5 pt-4 pb-3 border-b border-white/10">
                {title ? (
                  <h3
                    id={titleId}
                    className="font-display text-xl tracking-wide"
                  >
                    {title}
                  </h3>
                ) : null}
                {description ? (
                  <p id={descId} className="mt-1 text-sm text-ink-500">
                    {description}
                  </p>
                ) : null}
              </div>
            )}

            {/* body */}
            <div className="px-5 py-4">{children}</div>

            {/* footer */}
            {footer ? (
              <div className="px-5 py-3 border-t border-white/10 bg-surface/60 rounded-b-2xl">
                <div className="flex items-center justify-end gap-2">
                  {footer}
                </div>
              </div>
            ) : null}

            {/* close button (top-right) */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-md p-1.5 text-ink-300 hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
