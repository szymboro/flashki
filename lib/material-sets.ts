import fs from "fs";
import path from "path";

type MaterialContent = {
  id?: string;
  title?: string;
  description?: string;
  questions?: unknown[];
  flashcards?: unknown[];
};

export function getAllJsonFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllJsonFiles(fullPath);
    }

    return entry.name.endsWith(".json") ? [fullPath] : [];
  });
}

export function readMaterialFile(filePath: string): MaterialContent {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as MaterialContent;
}

export function isQuizSet(content: MaterialContent): boolean {
  return Array.isArray(content.questions);
}

export function isFlashcardSet(content: MaterialContent): boolean {
  return Array.isArray(content.flashcards);
}
