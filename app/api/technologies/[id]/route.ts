import {
  deleteTechnologies,
  getTechnologiesById,
  updateTechnologies,
} from "@/backend/controllers/technologies.controller";
import { Ctx } from "@/types";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  return getTechnologiesById(id);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  return updateTechnologies(req, id);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  return deleteTechnologies(req, id);
}
