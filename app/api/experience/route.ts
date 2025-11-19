import {
  createExperience,
  getExperiences,
} from "@/backend/controllers/experience.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return getExperiences(req);
};
export const POST = async (req: NextRequest) => {
  return createExperience(req);
};
