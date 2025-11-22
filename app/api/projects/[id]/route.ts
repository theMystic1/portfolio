import {
  deleteProjects,
  getProjectsById,
  updateProjects,
} from "@/backend/controllers/projects.controller";
import { Ctx } from "@/types";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: Ctx) {
  const par = await ctx?.params;

  return getProjectsById(par.id);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const par = await ctx.params;

  return updateProjects(req, par.id);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const par = await ctx.params;

  return deleteProjects(req, par.id);
}
