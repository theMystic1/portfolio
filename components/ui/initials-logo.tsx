"use client";

import * as React from "react";
import Image from "next/image";

// Create a data-URL SVG for initials (looks like your LU badge)
function makeInitialsDataUrl({
  text = "LU",
  size = 36, // final pixel size
  radius = 12, // corner radius
  bg = "#111927", // matches --color-surface
  ring = "rgba(255,255,255,0.10)",
  fill = "#f5c84c", // gold
  fontWeight = 800,
  fontSize = 16,
}: {
  text?: string;
  size?: number;
  radius?: number;
  bg?: string;
  ring?: string;
  fill?: string;
  fontWeight?: number;
  fontSize?: number;
}) {
  // Build the SVG (rounded card + subtle glow + center text)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b"/>
        </filter>
        <linearGradient id="r" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${ring}" />
          <stop offset="1" stop-color="${ring}" />
        </linearGradient>
      </defs>

      <rect x="0.5" y="0.5" width="${size - 1}" height="${
    size - 1
  }" rx="${radius}" ry="${radius}"
            fill="${bg}" stroke="url(#r)" stroke-width="1" />

      <!-- soft inner glow -->
      <rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="${
    radius - 2
  }" ry="${radius - 2}"
            fill="none" filter="url(#g)" opacity="0.25" />

      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-size="${fontSize}" font-weight="${fontWeight}"
            font-family="Cinzel, system-ui, ui-sans-serif, serif"
            fill="${fill}" letter-spacing="0.5">
        ${text}
      </text>
    </svg>
  `.trim();

  // Encode as data URL
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

export default function InitialsLogo({
  text = "LU",
  size = 36,
  className,
  alt = "Logo",
}: {
  text?: string;
  size?: number;
  className?: string;
  alt?: string;
}) {
  const src = React.useMemo(
    () =>
      makeInitialsDataUrl({
        text,
        size,
        fontSize: Math.round(size * 0.45), // scale nicely
        radius: Math.max(8, Math.round(size * 0.33)),
      }),
    [text, size]
  );

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      unoptimized // data URLs don't need Next optimization
      priority
    />
  );
}
