import jwt, { SignOptions, Secret } from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET is not set");
}
const JWT_SECRET: Secret = rawSecret;

export type AuthPayload = {
  _id: string;
  email: string;
  role: "USER" | "ADMIN";
};

const signOptions: SignOptions = {
  expiresIn: "7d", // ✅ this literal fits the ms.StringValue type
};

export function signJwt(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, signOptions);
}

export function verifyJwt(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
