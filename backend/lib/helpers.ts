import Cookies from "js-cookie";

type CookieOptions = Parameters<typeof Cookies.set>[2];
export const TOKEN_COOKIE = "portfolio-admin";

const cookieOpts: CookieOptions = {
  expires: 1,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function saveToken(token: string, days = 7) {
  Cookies.set(TOKEN_COOKIE, token, { ...cookieOpts, expires: days });
}
export function clearToken() {
  Cookies.remove(TOKEN_COOKIE, { path: "/" });
}
export function getToken() {
  return Cookies.get(TOKEN_COOKIE) ?? null;
}
