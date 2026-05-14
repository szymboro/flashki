import {
  getAllJsonFiles,
  isQuizSet,
  readMaterialFile,
} from "@/lib/material-sets";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const materialsDir = path.join(process.cwd(), "materials");
    const allFiles = getAllJsonFiles(materialsDir);

    const quizzes = allFiles
      .map((filePath) => {
        const content = readMaterialFile(filePath);
        return { content, filePath };
      })
      .filter(({ content }) => isQuizSet(content))
      .map(({ content, filePath }) => {
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
