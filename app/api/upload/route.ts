import { NextResponse } from "next/server";
import { minioClient, BUCKET_NAME } from "../../lib/minio";
import crypto from "crypto";
import path from "path";

export async function POST(req: Request) {
  try {
    // Read file from request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate a unique file name
    const ext = path.extname(file.name);
    const uniqueFileName = `${crypto.randomUUID()}${ext}`;

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Uploading file:", uniqueFileName); // Debugging log

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1"); // Change region if needed
    }

    // Upload to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      uniqueFileName,
      buffer,
      buffer.length,
      {
        "Content-Type": file.type || "application/octet-stream",
      }
    );

    // Generate file URL
    const fileUrl = `${process.env.MINIO_PUBLIC_URL}/${BUCKET_NAME}/${uniqueFileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
