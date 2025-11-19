// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Cinzel, Montserrat } from "next/font/google";
import "@/styles/global.css";
import ClientLayout from "@/components/layouts/clientLayout";

const inter = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = { title: "Portfolio", description: "…" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased relative`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
