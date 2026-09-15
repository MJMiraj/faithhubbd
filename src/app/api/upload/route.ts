import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public/uploads");
    
    // Ensure the uploads directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if exists
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate a unique filename using UUID and original extension
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueName = `${uuidv4()}.${ext}`;
      const filepath = join(uploadDir, uniqueName);

      await writeFile(filepath, buffer);
      
      // The public URL
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload files." }, { status: 500 });
  }
}
