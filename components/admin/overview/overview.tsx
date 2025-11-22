"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import KpiCard from "@/components/admin/overview/kpi-card";
import DonutCard, { DonutSlice } from "@/components/admin/overview/donut-card";
import BarColumnsCard, {
  BarDatum,
} from "@/components/admin/overview/bar-columns-card";
import { OverviewApiResponse, Project } from "@/types";
import ProjectTable from "../projects/project-table";

// --- mock data (replace with API later) ---
const kpis = [
  { label: "Projects", value: 12, delta: +3, series: [5, 6, 7, 8, 9, 12] },
  {
    label: "Technologies",
    value: 28,
    delta: +2,
    series: [18, 21, 24, 26, 27, 28],
  },
  { label: "Experience Roles", value: 4, delta: 0, series: [2, 2, 3, 3, 4, 4] },
  {
    label: "Active This Month",
    value: 6,
    delta: 9,
    series: [7, 8, 8, 7, 6, 9],
  },
];

const mix: DonutSlice[] = [
  { label: "React/Next", value: 45, color: "var(--color-aurora-400)" },
  { label: "Node/API", value: 25, color: "var(--color-teal-400)" },
  { label: "Mobile (RN)", value: 20, color: "var(--color-ember-500)" },
  { label: "Other", value: 10, color: "var(--color-gold-500)" },
];

const bars: BarDatum[] = [
  { label: "Next.js", value: 12, color: "var(--color-aurora-400)" },
  { label: "TypeScript", value: 11, color: "var(--color-info-500)" },
  { label: "Tailwind", value: 10, color: "var(--color-teal-400)" },
  { label: "GSAP", value: 7, color: "var(--color-ember-500)" },
  { label: "RN/Expo", value: 6, color: "var(--color-coral-500)" },
];

const RECENT: Project[] = [
  {
    _id: "p1",
    title: "Portfolio Platform",
    description: "Next.js + GSAP + Admin CMS",
    technologies: ["Next.js", "TypeScript", "Tailwind", "GSAP"],
    features: ["Animated Hero", "Admin CMS", "Starfield"],
    coverImage: "/images/portfolio-cover.jpg",
    createdAt: "2024-08-01",
  },
  {
    _id: "p2",
    title: "Service Marketplace",
    description: "React Native + Supabase",
    technologies: ["React Native", "Expo", "Supabase"],
    features: ["Auth", "Bookings", "Chat"],
    coverImage: "/images/marketplace.jpg",
    updatedAt: "2024-10-10",
  },
  {
    _id: "p3",
    title: "Analytics Dashboard",
    description: "RBAC + Charts + Audit",
    technologies: ["Next.js", "Node", "Postgres"],
    features: ["RBAC", "Audit Trail", "Charts"],
    coverImage: "/images/admin-analytics.jpg",
    updatedAt: "2024-11-05",
  },
];

export default function AdminOverviewPage({
  overview,
}: {
  overview: OverviewApiResponse;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.from(".reveal-kpi", {
        y: 18,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
      });

      gsap.from(".reveal-chart", {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.1,
      });

      gsap.from(".reveal-table", {
        y: 26,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.15,
      });
    },
    { scope: rootRef }
  );
  // console.log(overview);

  const { data } = overview;

  // console.log(data);

  const realMix = Object.entries(data?.workMix)?.map(([k, v], i) => ({
    label: k,
    value: v,
    color: mix[i]?.color,
  }));

  type TopTech = { label: string; value: number };
  type Bar = { color?: string };

  const mixe = (bars ?? [])
    .map((b: Bar) => b?.color)
    .filter(Boolean) as string[]; // the color pool

  const pickRandomFromMix = () => mixe[Math.floor(Math.random() * mixe.length)]; // may be undefined if mix empty

  const realData = (data?.topTechnologies ?? []).map(
    (tec: TopTech, i: number) => ({
      ...tec,
      color: bars?.[i]?.color ?? pickRandomFromMix(),
    })
  );

  return (
    <div ref={rootRef} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Overview</h1>
          <p className="text-dim text-sm">
            Snapshot of projects, technology mix, and recent activity.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object?.entries(data?.kpis).map(([k, v], i) => (
          <div key={k} className="reveal-kpi">
            <KpiCard
              label={k}
              value={v}
              delta={kpis[i]?.delta}
              series={kpis[i]?.series}
            />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1  gap-4">
        <div className="reveal-chart xl:col-span-1">
          <DonutCard
            title="Work Mix"
            subtitle="By area of focus"
            slices={realMix}
          />
        </div>
        <div className="reveal-chart xl:col-span-2">
          <BarColumnsCard
            title="Top Technologies Used"
            subtitle="Count across projects"
            data={realData}
            max={12}
          />
        </div>
      </div>

      {/* Recent table */}
      <div className="reveal-table">
        <div className="mb-3">
          <h2 className="font-display text-xl">Recent Projects</h2>
          <p className="text-dim text-sm">Latest updates in your portfolio.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface/70 p-3">
          <ProjectTable data={data?.recent} />
        </div>
      </div>
    </div>
  );
}
