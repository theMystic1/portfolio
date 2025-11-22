"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiMail, FiPhone } from "react-icons/fi";
import Button from "@/components/btn";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  email?: string;
  phone?: string;
  blurb?: string;
};

export default function ContactSection({
  email = "cluckyugo@gmail.com",
  phone = "+234 8146062722",
  blurb = "Have a project in mind or want to collaborate? Feel free to reach out — I’m always open to discussing new opportunities.",
}: Props) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Entrance: section fades at ~15% viewport, then items stagger
  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".contact-stagger");
        const fields = gsap.utils.toArray<HTMLElement>(".contact-field");

        gsap.set(sectionRef.current, {
          autoAlpha: 0,
          y: prefersReduced ? 0 : 16,
        });
        gsap.set(items, { autoAlpha: 0, y: prefersReduced ? 0 : 12 });
        gsap.set(fields, { autoAlpha: 0, y: prefersReduced ? 0 : 10 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%", // ≈ 15% in view
            once: true,
          },
        });

        tl.to(sectionRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: prefersReduced ? 0.2 : 0.5,
        })
          .to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.2 : 0.45,
              stagger: prefersReduced ? 0 : 0.08,
            },
            "-=0.1"
          )
          .to(
            fields,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.15 : 0.35,
              stagger: prefersReduced ? 0 : 0.06,
            },
            "-=0.2"
          );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  // very light client submit (replace with your API)
  const [submitting, setSubmitting] = React.useState(false);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();

    // Build the body with CRLF line breaks (better cross-client support)
    const body = [`From: ${name} <${email}>`, "", message].join("\r\n");

    // Use URLSearchParams to safely encode subject/body (and optional cc/bcc)
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);

    // Optional:
    // params.set("cc", email);  // cc the sender (if you want)
    // params.set("bcc", "archive@yourdomain.com");

    const href = `mailto:${encodeURIComponent(email)}?${params.toString()}`;

    // Open the mail client
    window.location.href = href;

    // …then clear the inputs
    requestAnimationFrame(() => {
      // either approach works:
      // e.currentTarget.reset();
      formRef.current?.reset();
    });
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative mx-auto max-w-6xl px-4 md:px-8 py-20"
    >
      {/* soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-64 w-[75%] -translate-x-1/2 rounded-[80px] blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(45,212,191,.18), rgba(96,165,250,.14), transparent 70%)",
        }}
      />

      <h2 className="contact-stagger text-center text-3xl md:text-4xl font-extrabold font-display">
        Get In{" "}
        <span className="bg-clip-text text-transparent bg-linear-to-r from-teal-400 via-aurora-400 to-gold-500">
          Touch
        </span>
      </h2>
      <p className="contact-stagger mx-auto mt-3 max-w-2xl text-center text-dim">
        {blurb}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: info panel */}
        <div className="contact-stagger rounded-3xl border border-white/10 bg-surface/80 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold font-display">
            Let&apos;s Connect
          </h3>
          <p className="mt-2 text-sm text-ink-300">
            I’m actively building beautiful, performant products across web and
            mobile. Reach out and let’s create something great.
          </p>

          {/* Email */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-400 border border-white/10">
              <FiMail />
            </span>
            <div className="leading-tight">
              <div className="text-[12px] uppercase tracking-wide text-ink-500">
                Email
              </div>
              <a href={`mailto:${email}`} className="text-sm text-ink-100">
                {email}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-aurora-400/15 text-aurora-400 border border-white/10">
              <FiPhone />
            </span>
            <div className="leading-tight">
              <div className="text-[12px] uppercase tracking-wide text-ink-500">
                Phone
              </div>
              <a href={`tel:${phone}`} className="text-sm text-ink-100">
                {phone}
              </a>
            </div>
          </div>

          {/* Availability card */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-ink-100">
              <span className="h-2.5 w-2.5 rounded-full bg-success-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              Available for opportunities
            </div>
            <p className="mt-1 text-xs text-ink-500">
              Open to full-time roles, contracts, and collaborations.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="contact-stagger rounded-3xl border border-white/10 bg-surface/80 p-6 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <Field label="Name">
              <input
                name="name"
                required
                placeholder="Your name"
                className="contact-field h-12 w-full rounded-xl border border-white/10 bg-elevated px-4 text-ink-100 placeholder:text-ink-500 outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              />
            </Field>

            {/* Email */}
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className="contact-field h-12 w-full rounded-xl border border-white/10 bg-elevated px-4 text-ink-100 placeholder:text-ink-500 outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              />
            </Field>

            {/* Subject */}
            <Field label="Subject">
              <input
                name="subject"
                required
                placeholder="What’s this about?"
                className="contact-field h-12 w-full rounded-xl border border-white/10 bg-elevated px-4 text-ink-100 placeholder:text-ink-500 outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              />
            </Field>

            {/* Message */}
            <Field label="Message">
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell me about your project or idea…"
                className="contact-field w-full rounded-xl border border-white/10 bg-elevated p-4 text-ink-100 placeholder:text-ink-500 outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              />
            </Field>

            <Button variant="aurora">Submit</Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-ink-300">{label}</span>
      {children}
    </label>
  );
}
