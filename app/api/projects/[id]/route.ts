import {
  deleteProjects,
  getProjectsById,
  updateProjects,
} from "@/backend/controllers/projects.controller";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getProjectsById(params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateProjects(req, params.id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteProjects(req, params.id);
}
