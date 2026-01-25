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

    const flashcardFile = files.find(
      (file) =>
        !file.startsWith("quiz_") &&
        file.endsWith(".json") &&
        file.includes(id),
    );

    if (!flashcardFile) {
      // Find flashcard file by reading each flashcard file and checking the ID
      for (const file of files) {
        if (!file.startsWith("quiz_") && file.endsWith(".json")) {
          const filePath = path.join(materialsDir, file);
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
    }

    const filePath = path.join(materialsDir, flashcardFile);
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error reading flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to load flashcard set" },
      { status: 500 },
    );
  }
}
