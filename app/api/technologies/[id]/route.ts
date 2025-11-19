import {
  deleteTechnologies,
  getTechnologiesById,
  updateTechnologies,
} from "@/backend/controllers/technologies.controller";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getTechnologiesById(params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateTechnologies(req, params.id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteTechnologies(req, params.id);
}
