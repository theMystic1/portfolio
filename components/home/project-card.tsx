"use client";

import * as React from "react";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { ProjectDocument } from "@/types";

export type TechTag = { label: string };

export type Project = {
  title: string;
  image: string;
  tags: TechTag[];
  problem: string;
  solution: string;
  result: string;
  href?: string;
};

type Props = {
  project: ProjectDocument;
  className?: string;
};

export function ProjectCard({ project, className }: Props) {
  const {
    title,
    coverImage: image,
    technologies,
    description,
    features,
    liveUrl,
    githubUrl,
  } = project;

  console.log(project);
  return (
    <article
      className={clsx(
        "project-card group relative overflow-hidden rounded-3xl border border-white/10 bg-surface/80 shadow/20 transition-transform duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      {/* screenshot */}
      <div className="relative m-3 overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* subtle neon around the image edge */}
          <div
            className="absolute -inset-4 rounded-[28px] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(168,85,247,.25), rgba(56,189,248,.15), transparent 70%)",
            }}
          />
        </div>

        <Image
          src={image}
          alt={title}
          width={1200}
          height={750}
          className="relative z-10 block h-45 w-full object-cover"
          priority={false}
        />

        {/* purple nebula overlay at bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-full bg-black/60"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(24,24,27,.55) 35%, rgba(24,24,27,.85) 100%)",
          }}
        />

        {/* title + tags over image bottom */}
        <div className="absolute inset-x-0 bottom-0 z-30 p-4">
          <h3 className="text-xl font-bold bg-linear-to-r from-aurora-400 via-coral-500 to-gold-500 text-transparent bg-clip-text font-display">
            {title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {technologies?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-ink-100/90 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* lower content */}
      <div className="relative z-10 px-5 pb-6">
        <InfoBlock label="Description" text={description!} />
        <InfoBlock
          label="Features"
          text={features?.join(" ,  ") ?? ""}
          className="mt-4"
        />
        <InfoBlock label="Links" text={""} className="mt-4" />
        {liveUrl ? (
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-4 py-2 text-sm font-medium text-black shadow-gold transition hover:shadow-gold-lg"
          >
            View Case Study
          </Link>
        ) : (
          <p className="p-4 text-gold-500 text-2xl">Withheld</p>
        )}
      </div>
    </article>
  );
}

function InfoBlock({
  label,
  text,
  className,
}: {
  label: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] uppercase tracking-wide text-ink-500">
        {label}
      </div>
      <p className="mt-1 text-[13px] leading-6 text-ink-100/90 capitalize">
        {text}
      </p>
    </div>
  );
}
