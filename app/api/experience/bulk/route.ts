import { createManyExperiences } from "@/backend/controllers/bulk.controller";
export async function POST(req: Request) {
  return createManyExperiences(req as any);
}
