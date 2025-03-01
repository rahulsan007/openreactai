import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
      })
    );

    const fileUrl = `${process.env.CF_R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
