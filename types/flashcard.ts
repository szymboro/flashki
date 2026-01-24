export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: string;
}
