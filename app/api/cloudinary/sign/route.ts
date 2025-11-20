import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { folder, public_id, resource_type = "image" } = await req.json();

    const timestamp = Math.floor(Date.now() / 1000);

    // Only include params you intend to allow the client to send
    const paramsToSign: Record<string, any> = {
      timestamp,
      folder: folder || process.env.CLOUDINARY_UPLOAD_FOLDER || "portfolio",
      public_id,
    };

    const signature = cloudinary.v2.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: paramsToSign.folder,
      resource_type,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "sign error" },
      { status: 500 }
    );
  }
}
