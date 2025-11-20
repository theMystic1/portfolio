// app/api/technologies/[id]/route.ts
import {
  deleteExperience,
  getExperienceById,
  updateExperience,
} from "@/backend/controllers/experience.controller";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getExperienceById(params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await params;
  console.log(params?.id);
  return updateExperience(req, id.id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const par = await params;

  return deleteExperience(req, par.id);
}
