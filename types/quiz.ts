export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface QuizSet {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  createdAt: string;
}
