import { FlashcardSet } from "@/types/flashcard";
import { QuizSet } from "@/types/quiz";

const FLASHCARD_STORAGE_KEY = "flashki_flashcard_sets";
const QUIZ_STORAGE_KEY = "flashki_quiz_sets";

export function saveFlashcardSet(set: FlashcardSet): void {
  const sets = getFlashcardSets();
  const existingIndex = sets.findIndex((s) => s.id === set.id);
  if (existingIndex >= 0) {
    sets[existingIndex] = set;
  } else {
    sets.push(set);
  }
  localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(sets));
}

export function getFlashcardSets(): FlashcardSet[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(FLASHCARD_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteFlashcardSet(id: string): void {
  const sets = getFlashcardSets().filter((s) => s.id !== id);
  localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(sets));
}

export function saveQuizSet(set: QuizSet): void {
  const sets = getQuizSets();
  const existingIndex = sets.findIndex((s) => s.id === set.id);
  if (existingIndex >= 0) {
    sets[existingIndex] = set;
  } else {
    sets.push(set);
  }
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(sets));
}

export function getQuizSets(): QuizSet[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteQuizSet(id: string): void {
  const sets = getQuizSets().filter((s) => s.id !== id);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(sets));
}

export function exportFlashcardSet(set: FlashcardSet): string {
  return JSON.stringify(set, null, 2);
}

export function exportQuizSet(set: QuizSet): string {
  return JSON.stringify(set, null, 2);
}
