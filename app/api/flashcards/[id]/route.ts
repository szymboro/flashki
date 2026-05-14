import {
  getAllJsonFiles,
  isFlashcardSet,
  readMaterialFile,
} from "@/lib/material-sets";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const materialsDir = path.join(process.cwd(), "materials");
    const allFiles = getAllJsonFiles(materialsDir);

    for (const filePath of allFiles) {
      const content = readMaterialFile(filePath);

      if (isFlashcardSet(content) && content.id === id) {
        return NextResponse.json(content);
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
