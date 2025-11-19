// src/app/api/admin/overview/route.ts
import { getAdminOverview } from "@/backend/controllers/overview.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return getAdminOverview(req);
}
