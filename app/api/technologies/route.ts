import {
  createTechnologies,
  getTechnologies,
} from "@/backend/controllers/technologies.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return getTechnologies(req);
};
export const POST = async (req: NextRequest) => {
  return createTechnologies(req);
};
