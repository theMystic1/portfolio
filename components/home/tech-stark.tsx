// components/tech/icons.tsx
"use client";

import * as React from "react";
import {
  // Languages
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  // Frontend
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTailwindcss,
  SiRedux,
  SiBootstrap,
  SiMui,
  SiJquery,
  // Backend
  SiNodedotjs,
  SiExpress,
  SiDjango,
  SiTensorflow,
  SiFastapi,
  SiGraphql,
  SiPostman,
  SiSupabase,
  // Database
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiRedis,
  SiFirebase,
  // DevOps & Cloud
  SiDocker,
  SiAmazonwebservices,
  SiGit,
  SiVercel,
  SiNetlify,
  SiJenkins,
  SiLinux,
  SiExpo,
  SiFramer,
  SiGreensock,
} from "react-icons/si";

export type TechItem = {
  name: string;
  Icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color?: string; // brand color
};

export const TECH = {
  languages: [
    { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
    // { name: "Python", Icon: SiPython, color: "#3776AB" },
    // { name: "C++", Icon: SiCplusplus, color: "#00599C" },
    { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", Icon: SiCss3, color: "#1572B6" },
  ] satisfies TechItem[],

  frontend: [
    { name: "React", Icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" }, // white works on dark bg
    // { name: "Angular", Icon: SiAngular, color: "#DD0031" },
    { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Redux", Icon: SiRedux, color: "#764ABC" },
    { name: "Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
    { name: "Material UI", Icon: SiMui, color: "#007FFF" },
    // { name: "jQuery", Icon: SiJquery, color: "#0769AD" },
    { name: "React Native", Icon: SiReact, color: "#61DAFB" }, // mobile
    { name: "Expo", Icon: SiExpo, color: "#520b7e" },
    { name: "Framer Motion", Icon: SiFramer, color: "#13a306" },
    { name: "GSAP", Icon: SiGreensock, color: "#88CE02" },
    // { name: "Framer Motion", Icon: SiG, color: "#13a306" },
  ] satisfies TechItem[],

  backend: [
    { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
    { name: "Express", Icon: SiExpress, color: "#000000" },
    // { name: "Django", Icon: SiDjango, color: "#092E20" },
    // { name: "TensorFlow", Icon: SiTensorflow, color: "#FF6F00" },
    // { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
    // { name: "GraphQL", Icon: SiGraphql, color: "#E10098" },
    { name: "REST (Postman)", Icon: SiPostman, color: "#FF6C37" },
    { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E" },
  ] satisfies TechItem[],

  database: [
    { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
    { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
    { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
    { name: "SQLite", Icon: SiSqlite, color: "#003B57" },
    { name: "Redis", Icon: SiRedis, color: "#DC382D" },
    { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E" },
    { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  ] satisfies TechItem[],

  devops: [
    { name: "Docker", Icon: SiDocker, color: "#2496ED" },
    { name: "AWS", Icon: SiAmazonwebservices, color: "#FF9900" },
    { name: "Git", Icon: SiGit, color: "#F05032" },
    { name: "Vercel", Icon: SiVercel, color: "#FFFFFF" }, // white on dark
    { name: "Netlify", Icon: SiNetlify, color: "#00C7B7" },
    { name: "Jenkins", Icon: SiJenkins, color: "#D24939" },
    { name: "Linux", Icon: SiLinux, color: "#FCC624" },
  ] satisfies TechItem[],
} as const;

/** helper: convert #RRGGBB + alpha (0–1) to rgba() */
function hexToRgba(hex?: string, a = 0.25) {
  if (!hex) return `rgba(255,255,255,${a})`;
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Small tile with neon brand glow
// ...existing imports & types above

// Small tile with neon brand glow
export function TechTile({
  name,
  Icon,
  color,
  className, // ← add this
}: TechItem & { className?: string }) {
  const iconColor =
    color && color.toLowerCase() === "#000000" ? "#ffffff" : color || "#ffffff";

  return (
    <div
      className={
        "group relative rounded-2xl border border-white/10 bg-surface/60 px-4 py-3 backdrop-blur-sm transition hover:border-white/20 " +
        (className ?? "")
      }
    >
      {/* brand-tinted glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-md transition group-hover:opacity-100"
        style={{
          background: `radial-gradient(60% 60% at 50% 50%, ${hexToRgba(
            color,
            0.25
          )}, ${hexToRgba(color, 0.12)} 45%, transparent 70%)`,
        }}
      />
      <div className="flex items-center gap-3">
        <Icon
          className="h-7 w-7 drop-shadow"
          style={{
            color: iconColor,
            filter: `drop-shadow(0 0 8px ${hexToRgba(color, 0.45)})`,
          }}
        />
        <span className="text-sm text-ink-100">{name}</span>
      </div>
    </div>
  );
}
