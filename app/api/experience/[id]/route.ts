import {
  deleteExperience,
  getExperienceById,
  updateExperience,
} from "@/backend/controllers/experience.controller";
import { Ctx } from "@/types";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: Ctx) {
  const par = await ctx.params;
  return getExperienceById(par.id);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const id = await ctx.params;
  return updateExperience(req, id.id);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const par = await ctx.params;

  return deleteExperience(req, par.id);
}
