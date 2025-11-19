import { login } from "@/backend/controllers/user.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return login(req);
};
