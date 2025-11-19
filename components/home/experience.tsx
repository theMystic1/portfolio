"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TimelineCard, { TimelineCardProps } from "./card";
import { BsHouse } from "react-icons/bs";
import { GiSpookyHouse } from "react-icons/gi";

gsap.registerPlugin(ScrollTrigger);

const ITEMS: TimelineCardProps[] = [
  {
    title: "Associate Software Engineer",
    org: "Basel Dynamic Tech Solutions",
    meta: "Present",
    body: "Contributing to full-stack projects, working in Agile teams to build scalable applications with optimized UI/UX.",
  },
  {
    title: "Freelancer – Web Developer",
    org: "SVS Detailing Services",
    meta: "2024",
    body: "Delivered a clean, dynamic web presence with emphasis on performance and mobile experience.",
  },
  {
    title: "Freelancer – Frontend Developer",
    org: "SreeTeq Services",
    meta: "2024",
    body: "Responsive, interactive websites tailored to client needs using modern frontend technologies.",
  },
];

export default function Experience() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const spineRef = React.useRef<HTMLDivElement>(null);

  // stable arrays — do NOT mutate during render
  const nodeRefs = React.useRef<HTMLDivElement[]>([]);
  const cardRefs = React.useRef<HTMLDivElement[]>([]);
  const setNodeRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) nodeRefs.current[i] = el;
  };
  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[i] = el;
  };

  useGSAP(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const nodes = nodeRefs.current.filter(Boolean);
    const cards = cardRefs.current.filter(Boolean);

    gsap.set(spineRef.current, {
      scaleY: 0,
      transformOrigin: "center top",
    });
    gsap.set(nodes, { scale: 0.6, autoAlpha: 0 });
    gsap.set(cards, { y: reduce ? 0 : 18, autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });

    tl.to(spineRef.current, { scaleY: 1, duration: reduce ? 0.2 : 0.6 })
      .to(
        nodes,
        {
          scale: 1,
          autoAlpha: 1,
          duration: reduce ? 0.2 : 0.4,
          stagger: reduce ? 0 : 0.06,
        },
        "-=0.2"
      )
      .to(
        cards,
        {
          y: 0,
          autoAlpha: 1,
          duration: reduce ? 0.25 : 0.55,
          stagger: reduce ? 0 : 0.12,
        },
        "-=0.1"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-6xl px-4 md:px-6 py-24"
      id="experience"
    >
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="hero-title text-3xl md:text-4xl tracking-[0.06em] uppercase font-display">
          Journey & Experience
        </h2>
        <div className="mx-auto mt-2 h-[3px] w-16 rounded-full bg-ember-500 shadow-[0_0_12px_rgba(251,146,60,0.35)]" />
        <p className="mt-3 text-dim text-[13px]">
          My path as a developer, forged through dedication and continuous
          growth.
        </p>
      </div>

      {/* Spine: left on mobile, centered on md+ */}
      <div
        ref={spineRef}
        className="
    pointer-events-none absolute
    left-8 md:left-1/2 md:-translate-x-1/2
    md:top-60 top-96 bottom-0               
    w-px bg-white/14
  "
      />

      {/* Rows: 1 per item. Mobile: [spine gutter (2rem), card]; md+: [card | spine | card] */}
      <div className="relative flex flex-col gap-12 md:gap-24">
        {ITEMS.map((item, i) => {
          const isLeft = i % 2 === 0; // alternate on desktop
          return (
            <div
              key={i}
              className="grid grid-cols-[2rem_1fr] md:grid-cols-[1fr_2px_1fr] items-center gap-x-4 md:gap-x-16"
            >
              {/* Node: col-1 (mobile), col-2 (md+) */}
              <div className="col-start-1 md:col-start-2 flex items-center justify-center">
                <div ref={setNodeRef(i)} className="relative h-10 w-10">
                  <span className="absolute inset-0 rounded-full bg-amber-600/18 blur-[10px]" />
                  <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/55" />
                  <span className="absolute left-1/2 top-1/2 md:h-8 md:w-8 min-h-5 min-w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface border-3 border-elevated shadow-gold flex items-center justify-center text-coral-500">
                    <GiSpookyHouse />
                  </span>
                </div>
              </div>

              {/* Card cell: col-2 on mobile; md+: left/right column */}
              <div
                className={
                  isLeft
                    ? "col-start-2 md:col-start-1"
                    : "col-start-2 md:col-start-3"
                }
              >
                <TimelineCard
                  ref={setCardRef(i)}
                  side={isLeft ? "left" : "right"}
                  {...item}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
