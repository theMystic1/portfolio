"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const paragraphs = [
  "As a dedicated developer, I channel the discipline and precision of Hinokami Kagura in my work. With every project, I strive to create beautiful, functional, and blazingly fast web experiences.",

  "My journey in web development began years ago, and like a Demon Slayer's training, it has been filled with challenges that have forged my skills to perfection. I specialize in frontend development with React, building responsive and elegant UIs, and adding the perfect amount of animation for a delightful user experience.",

  "When I'm not coding, I'm refining my techniques through continuous learning and experimentation — always seeking to master new breathing forms of development.",
];

const AboutMe: React.FC = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".about-p");

        // 1) Start hidden
        gsap.set(sectionRef.current, { y: 36, opacity: 0 });
        gsap.set([titleRef.current, subtitleRef.current, items], {
          y: 16,
          opacity: 0,
        });

        // 2) One timeline: container enters first (top ~85% viewport),
        //    THEN text pieces animate in.
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%", // ≈ when viewport is 15% into the section
              end: "bottom 25%",
              toggleActions: "play none none none",
              once: true, // only do the entrance once
            },
          })
          // container slide-in
          .to(sectionRef.current, { y: 0, opacity: 1, duration: 0.6 })
          // title then subtitle
          .to(titleRef.current, { y: 0, opacity: 1, duration: 0.55 }, "+=0.05")
          .to(
            subtitleRef.current,
            { y: 0, opacity: 1, duration: 0.55 },
            "-=0.25"
          )
          // paragraphs (staggered)
          .to(
            items,
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
            "-=0.1"
          );

        // 3) Gentle shimmer on the gradient word while in view
        gsap.fromTo(
          ".about-gradient",
          { filter: "brightness(0.95)" },
          {
            filter: "brightness(1.15)",
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "bottom 25%",
              toggleActions: "play pause resume pause",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="flex flex-col items-center justify-center gap-3"
    >
      <div className="flex flex-col gap-5 max-w-[700px]">
        <h1
          ref={titleRef}
          className="text-center text-4xl font-bold text-ink-300 font-display"
        >
          Character{" "}
          <span className="about-gradient bg-gradient-to-r from-ember-500 via-danger-500 to-success-500 text-transparent bg-clip-text">
            Profile
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-ink-300 text-3xl text-center font-display"
        >
          <span className="text-amber-500">Passionate Web Developer</span>{" "}
          forging blazing-fast digital experiences with precision and
          creativity.
        </p>

        <div className="flex flex-col gap-5">
          {paragraphs.map((pr, i) => (
            <p
              key={i}
              className="about-p text-xs leading-6 text-ink-100/90 text-center"
            >
              {pr}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
