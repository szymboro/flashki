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

export async function GET() {
  try {
    const materialsDir = path.join(process.cwd(), "materials");
    const allFiles = getAllJsonFiles(materialsDir);

    const quizzes = allFiles
      .filter((filePath) => {
        const name = path.basename(filePath);
        return name.startsWith("quiz_");
      })
      .map((filePath) => {
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const filename = path.relative(materialsDir, filePath);

        return {
          id: content.id,
          title: content.title,
          description: content.description,
          questionCount: content.questions?.length || 0,
          filename,
        };
      });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error reading quizzes:", error);
    return NextResponse.json(
      { error: "Failed to load quizzes" },
      { status: 500 },
    );
  }
}
