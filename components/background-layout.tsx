"use client";

import * as React from "react";

type StarfieldProps = {
  className?: string;
  /** 0.3–1.2 is a good range */
  density?: number;
  /** 0.15–0.6 is a good range */
  speed?: number;
  /** warm oranges/reds like your screenshot */
  colors?: readonly string[];
  /** subtle brightness breathing */
  twinkle?: boolean;
  /** show one soft hero glow near top-center */
  heroGlow?: boolean;
  /** cap FPS for perf */
  maxFps?: number;
};

type Layer = 0 | 1 | 2;

type Star = {
  x: number;
  y: number;
  r: number; // radius bucket multiplier
  a: number; // base alpha
  t: number; // twinkle phase
  ts: number; // twinkle speed
  layer: Layer;
  colorIdx: number; // palette index
};

const WARM_PALETTE = [
  "#fca5a5", // light red
  "#fb923c", // orange
  "#f59e0b", // amber
  "#f87171", // red
  "#fdba74", // light orange
] as const;

export default function StarfieldBackground({
  className = "",
  density = 0.75,
  speed = 0.35,
  colors = WARM_PALETTE,
  twinkle = true,
  heroGlow = true,
  maxFps = 30,
}: StarfieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return; // runtime guard

    // 👇 non-nullable aliases (fixes: 'canvas' is possibly 'null')
    const canvas: HTMLCanvasElement = c;

    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    // -------- sizing / state --------
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let last = 0;
    const frameInterval = 1000 / Math.max(15, Math.min(maxFps, 60));

    // Use runtime vars so we don't reassign props
    let runtimeSpeed = speed;
    let runtimeDensity = density;

    // Parallax: back → front
    const LAYER_SPEED = [0.35, 0.65, 1.0] as const;
    const LAYER_SIZE = [0.55, 0.9, 1.2] as const;
    const LAYER_ALPHA = [0.55, 0.75, 0.95] as const;

    let stars: Star[] = [];

    // Hero glow (soft big orb) state
    let glowPhase = Math.random() * Math.PI * 2;

    // We force DPR=1 to keep perf on laptops
    function setSize(): void {
      const dpr = 1;
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Offscreen sprite cache so we don’t blur every frame
    const spriteCache: Map<string, HTMLCanvasElement> = new Map();
    const sizeBuckets = [0.8, 1.0, 1.3] as const; // tiny → small → slightly bigger

    function makeSprite(color: string, coreRadius: number): HTMLCanvasElement {
      const s = Math.ceil(coreRadius * 8);
      const off = document.createElement("canvas");
      off.width = s;
      off.height = s;
      const c = off.getContext("2d")!;
      const cx = s / 2;
      const cy = s / 2;

      // Halo gradient (warm tint)
      const grad = c.createRadialGradient(
        cx,
        cy,
        coreRadius * 0.1,
        cx,
        cy,
        coreRadius * 3.2
      );
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.25, hexToRgba(color, 0.8));
      grad.addColorStop(1, "rgba(255,255,255,0.0)");

      c.fillStyle = grad;
      c.beginPath();
      c.arc(cx, cy, coreRadius * 3.2, 0, Math.PI * 2);
      c.fill();

      // Bright core
      c.fillStyle = "white";
      c.beginPath();
      c.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      c.fill();

      return off;
    }

    function hexToRgba(hex: string, alpha = 1): string {
      const h = hex.replace("#", "");
      const long =
        h.length === 3 ? `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` : h;
      const bigint = parseInt(long, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function ensureSprites(): void {
      spriteCache.clear();
      colors.forEach((col, ci) => {
        sizeBuckets.forEach((sb, bi) => {
          const spr = makeSprite(col, 0.7 * sb);
          spriteCache.set(`${ci}-${bi}`, spr);
        });
      });
    }

    function rand(min: number, max: number): number {
      return Math.random() * (max - min) + min;
    }

    function choiceIdx(len: number): number {
      return Math.floor(Math.random() * len);
    }

    function buildStars(): void {
      const baseCount = Math.floor((width * height) / 11000);
      const count = Math.max(80, Math.floor(baseCount * runtimeDensity));
      stars = Array.from({ length: count }, (_, i) => {
        const layer = (i % 3) as Layer;
        const sizeIdx = choiceIdx(sizeBuckets.length);
        return {
          x: rand(0, width),
          y: rand(0, height),
          r: sizeBuckets[sizeIdx] * LAYER_SIZE[layer],
          a: rand(0.6, 1.0) * LAYER_ALPHA[layer],
          t: rand(0, Math.PI * 2),
          ts: rand(0.002, 0.008) * (layer + 1),
          layer,
          colorIdx: choiceIdx(colors.length),
        };
      });
    }

    // Soft vignette once per resize (subtle depth)
    let vignette: HTMLCanvasElement | null = null;
    function buildVignette(): void {
      vignette = document.createElement("canvas");
      vignette.width = width;
      vignette.height = height;
      const g = vignette.getContext("2d")!;
      const grad = g.createRadialGradient(
        width * 0.7,
        height * 0.25,
        60,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      // cool bluish-dark wash like the screenshot
      g.fillStyle = "#0E1621";
      g.fillRect(0, 0, width, height);

      grad.addColorStop(0, "rgba(255,255,255,0.10)");
      grad.addColorStop(1, "rgba(0,0,0,0.0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, width, height);
    }

    function drawHeroGlow(c: CanvasRenderingContext2D): void {
      if (!heroGlow) return;
      glowPhase += 0.0025; // slow drift
      const cx = width * 0.5 + Math.cos(glowPhase) * 40;
      const cy = height * 0.2 + Math.sin(glowPhase * 0.9) * 24;

      const rOuter = Math.max(width, height) * 0.035;
      const rInner = rOuter * 0.18;

      const grad = c.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
      grad.addColorStop(0, "rgba(255,236,209,0.35)"); // warm center
      grad.addColorStop(1, "rgba(255,236,209,0.00)");
      c.save();
      c.globalCompositeOperation = "lighter";
      c.fillStyle = grad;
      c.beginPath();
      c.arc(cx, cy, rOuter, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    function draw(ts: number): void {
      if (!running) return;
      if (ts - last < frameInterval) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = ts;

      ctx.clearRect(0, 0, width, height);
      if (vignette) ctx.drawImage(vignette, 0, 0);

      // stars
      for (const s of stars) {
        s.x -= runtimeSpeed * LAYER_SPEED[s.layer];
        if (s.x < -6) {
          s.x = width + 6;
          s.y = rand(0, height);
        }

        let alpha = s.a;
        if (twinkle) {
          s.t += s.ts;
          alpha *= 0.9 + 0.2 * (0.5 + 0.5 * Math.sin(s.t));
        }

        const sizeIdx = s.r <= 0.85 ? 0 : s.r <= 1.05 ? 1 : 2;
        const key = `${s.colorIdx}-${sizeIdx}`;
        const spr = spriteCache.get(key);
        if (spr) {
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.drawImage(spr, s.x - spr.width / 2, s.y - spr.height / 2);
        }
      }

      // hero glow orb
      drawHeroGlow(ctx);

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    function onResize(): void {
      setSize();
      ensureSprites();
      buildStars();
      buildVignette();
    }

    // Reduced motion: soften everything
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyPRM(): void {
      if (media.matches) {
        runtimeSpeed = Math.min(runtimeSpeed, 0.25);
        runtimeDensity = Math.min(runtimeDensity, 0.6);
      }
    }

    function onVisibility(): void {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    }

    // init
    setSize();
    ensureSprites();
    buildStars();
    buildVignette();
    applyPRM();
    raf = requestAnimationFrame(draw);

    // listeners (typed + compatible)
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", applyPRM);
    } else if (
      typeof (media as unknown as { addListener?: (cb: () => void) => void })
        .addListener === "function"
    ) {
      (
        media as unknown as { addListener: (cb: () => void) => void }
      ).addListener(applyPRM);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", applyPRM);
      } else if (
        typeof (
          media as unknown as { removeListener?: (cb: () => void) => void }
        ).removeListener === "function"
      ) {
        (
          media as unknown as { removeListener: (cb: () => void) => void }
        ).removeListener(applyPRM);
      }
    };
  }, [colors, density, heroGlow, maxFps, speed, twinkle]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
