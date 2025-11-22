import { createManyProjects } from "@/backend/controllers/bulk.controller";
export async function POST(req: Request) {
  return createManyProjects(req as any);
}
