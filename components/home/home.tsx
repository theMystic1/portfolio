"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { FiBookOpen } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import Typewriter from "../typer";
import Button from "@/components/btn";
import AboutMe from "./about-me";
import Experience from "./experience";
import TechGrid from "./stack-grid";
import ProjectsSection from "./projects";
import ContactSection from "./contact";
import { GetExperiencesResponse, GetProjectsResponse } from "@/types";
import { GiCleaver } from "react-icons/gi";
import { SiReaddotcv } from "react-icons/si";
import {
  BsGithub,
  BsLinkedin,
  BsTwitterX,
  BsWhatsapp,
  BsX,
} from "react-icons/bs";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const words = [
  "Frontend Development",

  "Mobile App Development",
  "Backend Development",
  "Open Source Contributor",
  // "Frontend Development",
  "Cross-Platform Development",
  "UI Implementation",
  "Code Optimization",
];

const socials = [
  {
    ICON: BsWhatsapp,
    link: "https://wa.me/2349057070949",
    color: "#16a34a",
  },
  {
    ICON: BsLinkedin,
    link: "https://www.linkedin.com/in/lucky-chukwujekwu-a6650727a/",
    color: "#60a5fa",
  },
  {
    ICON: BsTwitterX,
    link: "https://x.com/__ugochukwu",
    color: "#000",
  },
  {
    ICON: BsGithub,
    link: "https://github.com/theMystic1",
    color: "#fafafa",
  },
];

const HomeSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const greetRef = React.useRef<HTMLParagraphElement>(null);
  const nameRef = React.useRef<HTMLParagraphElement>(null);
  const credsRef = React.useRef<HTMLSpanElement>(null);
  const typeRef = React.useRef<HTMLHeadingElement>(null);
  const ctasRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      // initial states
      gsap.set(sectionRef.current, { opacity: 0, y: prefersReduced ? 0 : 24 });
      gsap.set([greetRef.current, typeRef.current, ctasRef.current], {
        opacity: 0,
        y: prefersReduced ? 0 : 12,
      });

      // Split sequences
      let nameSplit: SplitType | null = null;
      let credsSplit: SplitType | null = null;

      if (!prefersReduced && nameRef.current) {
        nameSplit = new SplitType(nameRef.current, { types: "chars" });
        gsap.set(nameSplit.chars, { yPercent: 100, opacity: 0 });
      }

      if (!prefersReduced && credsRef.current) {
        // word-by-word for credentials
        credsSplit = new SplitType(credsRef.current, { types: "words" });
        gsap.set(credsSplit.words, { opacity: 0, y: 10 });
      } else {
        // fallback: entire creds line hidden (no split)
        gsap.set(credsRef.current, { opacity: 0, y: 10 });
      }

      // Timeline: strict sequence
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // Section in
      tl.to(sectionRef.current, {
        opacity: 1,
        y: 0,
        duration: prefersReduced ? 0.2 : 0.6,
      });

      // Greeting (quick)
      tl.to(greetRef.current, {
        opacity: 1,
        y: 0,
        duration: prefersReduced ? 0.2 : 0.45,
      });

      // Name chars split (or whole line if reduced)
      if (nameSplit?.chars?.length) {
        tl.to(nameSplit.chars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.03,
        });
      } else {
        tl.to(nameRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.35,
        });
      }

      // Credentials words fade in after name
      if (credsSplit?.words?.length) {
        tl.to(credsSplit.words, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
        });
      } else {
        tl.to(credsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.35,
        });
      }

      // Typewriter line (just fade in container; typewriter handles its own typing)
      tl.to(typeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
      });

      // CTAs last
      tl.to(ctasRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
      });

      // Soft golden glow breathing while visible
      if (!prefersReduced) {
        const glow = sectionRef.current?.querySelectorAll(".hero-glow");
        if (glow?.length) {
          gsap.fromTo(
            glow,
            { opacity: 0, scale: 0.95, filter: "blur(28px)" },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(24px)",
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
          gsap.to(glow, {
            opacity: 0.9,
            scale: 1.02,
            duration: 2.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          });
        }
      }

      // cleanup
      return () => {
        nameSplit?.revert();
        credsSplit?.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[600px] flex-col items-center justify-center gap-3 text-center py-12"
    >
      {/* golden ambient glow */}
      {/* <div className="relative flex flex-col gap-5 min-h-[600px]"> */}
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(245,200,76,0.22), transparent 70%)",
            filter: "blur(24px)",
          }}
        />
      </div>

      <p ref={greetRef} className="text-lg md:text-xl text-ink-300 mb-1">
        Hello, I&apos;m
      </p>

      {/* split target: name */}
      <p
        ref={nameRef}
        className="text-gold-500 text-4xl md:text-6xl font-bold font-display"
      >
        Lucky Chukwujekwu
      </p>

      {/* credentials: split into words and fade one-by-one */}
      <span ref={credsRef} className="text-info-500">
        Web/mobile Engineer, Proficient in:
      </span>

      <h1
        ref={typeRef}
        className="md:text-4xl text-3xl font-bold bg-linear-to-r from-aurora-400 via-coral-500 to-gold-500 text-transparent bg-clip-text font-display"
      >
        <Typewriter
          words={words}
          typingSpeed={90}
          deletingSpeed={45}
          pauseBetween={1200}
        />
      </h1>

      <div
        ref={ctasRef}
        className="mt-2 flex items-center justify-center gap-4"
      >
        {/* <Link href="#projects">
          <Button variant="aurora" leadingIcon={<FiBookOpen />}>
            View Project
          </Button>
        </Link> */}
        <Link
          href="https://drive.google.com/file/d/1JdmIP0DA46OKkerODNX_ND8dkwf-u6bG/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="surface" leadingIcon={<SiReaddotcv />}>
            My Resume
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center w-full">
        <div className=" z-50 rounded-xl py-3 px-4 bg-surface/40 border border-ink-300 supports-backdrop-filter:backdrop-blur-md min-h-12 flex items-center gap-4">
          {socials.map((soc, i) => {
            const { ICON, color, link } = soc;
            return (
              <Link
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ICON color={color} size={28} />
              </Link>
            );
          })}
        </div>
      </div>
      {/* </div> */}
    </section>
  );
};

export default function HomePage({
  projects,
  experiences,
}: {
  projects: GetProjectsResponse;
  experiences: GetExperiencesResponse;
}) {
  return (
    <div className="w-full min-h-screen mt-10 flex flex-col gap-8">
      <HomeSection />

      <div className="bg-elevated flex flex-col gap-8 px-4 py-8 rounded-lg shadow-gold relative">
        <AboutMe />
        <Experience experiences={experiences} />
      </div>
      <TechGrid />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </div>
  );
}
