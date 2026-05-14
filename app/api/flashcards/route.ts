import {
  getAllJsonFiles,
  isFlashcardSet,
  readMaterialFile,
} from "@/lib/material-sets";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const materialsDir = path.join(process.cwd(), "materials");
    const allFiles = getAllJsonFiles(materialsDir);

    const flashcards = allFiles
      .map((filePath) => {
        const content = readMaterialFile(filePath);
        return { content, filePath };
      })
      .filter(({ content }) => isFlashcardSet(content))
      .map(({ content, filePath }) => {
        const filename = path.relative(materialsDir, filePath);

        return {
          id: content.id,
          title: content.title,
          description: content.description,
          flashcardCount: content.flashcards?.length || 0,
          filename,
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
