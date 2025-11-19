// components/Typewriter.tsx
"use client";
import React from "react";

type Props = {
  words: string[];
  typingSpeed?: number; // ms per letter when typing
  deletingSpeed?: number; // ms per letter when deleting
  pauseBetween?: number; // ms to hold when a word completes
  className?: string;
};

export default function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseBetween = 1200,
  className = "",
}: Props) {
  const [text, setText] = React.useState("");
  const [idx, setIdx] = React.useState(0); // which word
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!words.length) return;

    const current = words[idx % words.length];

    // pause at full word
    if (!isDeleting && text === current) {
      const t = setTimeout(() => setIsDeleting(true), pauseBetween);
      return () => clearTimeout(t);
    }
    // small pause before next word after deleting
    if (isDeleting && text === "") {
      const t = setTimeout(() => {
        setIsDeleting(false);
        setIdx((n) => (n + 1) % words.length);
      }, 200);
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => {
        const next = isDeleting
          ? current.slice(0, Math.max(0, text.length - 1))
          : current.slice(0, text.length + 1);
        setText(next);
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(t);
  }, [text, isDeleting, idx, words, typingSpeed, deletingSpeed, pauseBetween]);

  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-live="polite"
    >
      <span>{text}</span>
      <span className="tw-caret" aria-hidden="true" />
      <style jsx>{`
        .tw-caret {
          width: 2px;
          height: 1em;
          margin-left: 3px;
          background: currentColor;
          display: inline-block;
          animation: tw-blink 1s step-start infinite;
        }
        @keyframes tw-blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
