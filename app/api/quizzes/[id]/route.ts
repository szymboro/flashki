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

    const quizFile = files.find(
      (file) =>
        file.startsWith("quiz_") && file.endsWith(".json") && file.includes(id),
    );

    if (!quizFile) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const filePath = path.join(materialsDir, quizFile);
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error reading quiz:", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
