import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/backend/lib/mongoose";
// import { User } from "@/backend/models/user";
import { signJwt } from "@/backend/lib/jwt";
import { User } from "@/backend/lib/user.schema";

// POST /api/auth/register
export async function register(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    const user = await User.create({ name, email, password });

    const token = signJwt({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // You can set cookie instead if you want, but for now return token in body
    return NextResponse.json(
      {
        ok: true,
        message: "User registered successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/auth/login
export async function login(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signJwt({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Logged in successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
