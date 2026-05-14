import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

function getAllJsonFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getAllJsonFiles(fullPath);
    }
    return entry.name.endsWith(".json") ? [fullPath] : [];
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const materialsDir = path.join(process.cwd(), "materials");
    const allFiles = getAllJsonFiles(materialsDir);

    // Find flashcard file by reading each file and checking the ID
    for (const filePath of allFiles) {
      const name = path.basename(filePath);
      if (!name.startsWith("quiz_")) {
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (content.id === id) {
          return NextResponse.json(content);
        }
      }
    }

    return NextResponse.json(
      { error: "Flashcard set not found" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Error reading flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to load flashcard set" },
      { status: 500 },
    );
  }
}
