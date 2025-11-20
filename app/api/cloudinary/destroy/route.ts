import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { publicId, resource_type = "image" } = await req.json();
    if (!publicId) {
      return NextResponse.json({ error: "publicId required" }, { status: 400 });
    }
    const res = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type,
    });
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "destroy error" },
      { status: 500 }
    );
  }
}
