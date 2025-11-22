"use client";

import * as React from "react";
import clsx from "clsx";
import { ExperienceDocument } from "@/types";

export type TimelineSide = "left" | "right";
export interface TimelineCardProps {
  side?: TimelineSide;
  title?: string;
  org?: string;
  meta?: string;
  body?: string;
  className?: string;
  data?: ExperienceDocument;
}

const TimelineCard = React.forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ side = "left", title, org, meta, body, className, data }, ref) => {
    return (
      <div ref={ref} className={clsx("relative", className)}>
        {/* Connector stub from spine → card
           - Mobile: always from left edge
           - md+: from left/right based on side */}
        <span
          aria-hidden
          className={clsx(
            "absolute top-1/2 h-0.5 bg-white/14",
            // mobile (card is in col-2; spine is in col-1)
            "left-4 w-4",
            // desktop override
            side === "left"
              ? "md:right-6 md:left-auto md:w-6"
              : "md:left-6 md:right-auto md:w-6"
          )}
        />

        <article className="rounded-2xl border border-white/10 bg-surface/90 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <header className="mb-2">
            <h3 className="text-ink-100 font-semibold tracking-[0.01em] font-display">
              {data?.role} ({data?.company?.jobLocation})
            </h3>
            <p className="text-[13px] leading-5">
              <span className="text-ember-500">{data?.company?.name}</span>
              {
                <span className="text-ink-500">
                  {" "}
                  •{" "}
                  {data?.isCurrent
                    ? "Present"
                    : new Date(data?.endDate as any)?.getFullYear()}
                </span>
              }
            </p>
          </header>
          {data?.projects?.map((pr, i) => (
            <p
              className="text-[13px] leading-relaxed text-ink-300 mb-2"
              key={pr?.title + i}
            >
              {pr.description}
            </p>
          ))}
        </article>
      </div>
    );
  }
);

TimelineCard.displayName = "TimelineCard";
export default TimelineCard;
