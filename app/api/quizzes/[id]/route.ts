import {
  getAllJsonFiles,
  isQuizSet,
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

      if (isQuizSet(content) && content.id === id) {
        return NextResponse.json(content);
      }
    }

    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  } catch (error) {
    console.error("Error reading quiz:", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
