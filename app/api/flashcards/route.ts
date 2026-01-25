import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const materialsDir = path.join(process.cwd(), "materials");
    const files = fs.readdirSync(materialsDir);

    const flashcards = files
      .filter((file) => !file.startsWith("quiz_") && file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(materialsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        return {
          id: content.id,
          title: content.title,
          description: content.description,
          flashcardCount: content.flashcards?.length || 0,
          filename: file,
        };
      });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error reading flashcards:", error);
    return NextResponse.json(
      { error: "Failed to load flashcards" },
      { status: 500 },
    );
  }
}
