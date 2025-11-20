// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// which cookie contains your JWT
const COOKIE_NAME = "portfolio-admin";
// optional role to enforce
// const REQUIRED_ROLE = "admin";

async function verifyJWT(token?: string) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub?: string; role?: string; email?: string } | null;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  // read token
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = await verifyJWT(token);

  // console.log(user);

  // reject if no user or wrong role
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin-login";
    // return user here after login
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // allow through
  return NextResponse.next();
}

/**
 * Only run this middleware for these exact admin routes.
 * It won't affect other pages or API routes.
 */
export const config = {
  matcher: [
    "/admin-experience/:path*",
    "/admin-overview/:path*",
    "/admin-projects/:path*",
    "/admin-technologies/:path*",
    "/admin-register/:path*",
  ],
};
