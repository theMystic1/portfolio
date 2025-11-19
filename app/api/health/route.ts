import { ok, options } from "@/backend/lib/http";

export const runtime = "nodejs"; // prisma would need this too
export const revalidate = 0; // always dynamic

export function GET() {
  return ok({ status: "ok" });
}
export { options as OPTIONS };
