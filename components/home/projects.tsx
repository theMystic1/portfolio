"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project, ProjectCard } from "./project-card";
import { GetProjectsResponse } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection({
  projects,
}: {
  projects: GetProjectsResponse;
}) {
  const sectionRef = React.useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");

        // initial states
        gsap.set(sectionRef.current, {
          autoAlpha: 0,
          y: prefersReduced ? 0 : 20,
        });
        gsap.set(cards, {
          autoAlpha: 0,
          y: prefersReduced ? 0 : 18,
        });

        // section fade / slide
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%", // ~15% viewport visible
              once: true,
            },
          })
          .to(sectionRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: prefersReduced ? 0.2 : 0.6,
          })
          // card stagger
          .to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.2 : 0.5,
              stagger: prefersReduced ? 0 : 0.12,
            },
            "-=0.15"
          );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  const myProjects = projects?.projects;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative mx-auto max-w-7xl px-4 md:px-8 py-20"
    >
      {/* soft nebula glow behind heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-12 -z-10 h-56 w-[70%] -translate-x-1/2 rounded-full blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(168,85,247,.18), rgba(56,189,248,.12), transparent 70%)",
        }}
      />

      <h2 className="text-center text-3xl font-bold headline-gradient font-display">
        Projects
      </h2>
      <p className="mx-auto mt-3 max-w-3xl text-center text-dim">
        Explore projects that blend practical problem-solving with modern
        stacks.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {myProjects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}
