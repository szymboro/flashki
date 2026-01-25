import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const materialsDir = path.join(process.cwd(), "materials");
    const files = fs.readdirSync(materialsDir);

    // Find quiz file by reading each quiz file and checking the ID
    for (const file of files) {
      if (file.startsWith("quiz_") && file.endsWith(".json")) {
        const filePath = path.join(materialsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (content.id === id) {
          return NextResponse.json(content);
        }
      }
    }

    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  } catch (error) {
    console.error("Error reading quiz:", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
