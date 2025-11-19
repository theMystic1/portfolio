import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, AuthPayload } from "./jwt";

export function getAuthTokenFromRequest(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
}

export function getUserFromRequest(req: NextRequest): AuthPayload | null {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyJwt(token);
  return payload;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { ok: false, message: "Unauthorized" },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Bearer realm="api", error="invalid_token"',
      },
    }
  );
}
