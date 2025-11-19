// app/api/test/route.ts
import { dbConnect } from "@/backend/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Connect to MongoDB
    await dbConnect();

    // 2. Do any DB work here (queries, etc.)
    // For now we'll just return a success message
    return NextResponse.json({ ok: true, message: "DB connected ✅" });
  } catch (error: any) {
    console.error("DB connection error:", error);
    return NextResponse.json(
      { ok: false, message: "DB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
