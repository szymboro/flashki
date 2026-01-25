import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const materialsDir = path.join(process.cwd(), "materials");
    const files = fs.readdirSync(materialsDir);

    const quizzes = files
      .filter((file) => file.startsWith("quiz_") && file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(materialsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        return {
          id: content.id,
          title: content.title,
          description: content.description,
          questionCount: content.questions?.length || 0,
          filename: file,
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
