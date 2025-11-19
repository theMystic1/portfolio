// app/(admin)/layout.tsx
import AdminShell from "@/components/layouts/admin-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin • Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
