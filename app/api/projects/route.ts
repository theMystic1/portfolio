import {
  createProjects,
  getProjects,
} from "@/backend/controllers/projects.controller";

import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return getProjects(req);
};
export const POST = async (req: NextRequest) => {
  return createProjects(req);
};
