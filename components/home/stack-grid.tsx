"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TECH, TechTile } from "./tech-stark"; // or "@/components/tech/icons"

gsap.registerPlugin(ScrollTrigger);

export default function TechGrid() {
  const sectionRef = React.useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        // select all tiles inside this section
        const tiles = gsap.utils.toArray<HTMLElement>(".tech-tile");

        // initial states
        gsap.set(sectionRef.current, {
          autoAlpha: 0,
          y: prefersReduced ? 0 : 20,
        });
        gsap.set(tiles, {
          autoAlpha: 0,
          y: prefersReduced ? 0 : 16,
        });

        // 1) Section fades/slides in when ~15% enters the viewport
        // 2) Tiles then reveal one-by-one
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%", // ≈ 10–15% visible
              once: true,
            },
          })
          .to(sectionRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: prefersReduced ? 0.2 : 0.6,
          })
          .to(
            tiles,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.2 : 0.5,
              stagger: prefersReduced ? 0 : 0.07,
            },
            "-=0.2"
          );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 md:px-8 py-16"
      id="skills"
    >
      <h2 className="text-center text-3xl font-bold mb-2 headline-gradient font-display">
        Technologies I Work With
      </h2>
      <p className="text-center text-dim mb-10">
        Cutting-edge tools and frameworks for building the future
      </p>

      {(
        [
          ["Languages", TECH.languages],
          ["Frontend", TECH.frontend],
          ["Backend", TECH.backend],
          ["Database", TECH.database],
          ["DevOps & Cloud", TECH.devops],
        ] as const
      ).map(([title, list]) => (
        <div key={title} className="mb-10">
          <h3 className="mb-4 text-lg font-semibold font-display">{title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {list.map((t) => (
              <TechTile key={t.name} {...t} className="tech-tile" />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
