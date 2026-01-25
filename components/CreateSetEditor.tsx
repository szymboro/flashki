"use client";

import { saveFlashcardSet, saveQuizSet } from "@/lib/storage";
import { Flashcard, FlashcardSet } from "@/types/flashcard";
import { QuizQuestion, QuizSet } from "@/types/quiz";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CreateSetEditorProps {
  onPublish: (data: QuizSet | FlashcardSet) => void;
}

export default function CreateSetEditor({ onPublish }: CreateSetEditorProps) {
  const router = useRouter();
  const [type, setType] = useState<"quiz" | "flashcard">("quiz");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // For quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // For flashcard
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (
    index: number,
    field: keyof QuizQuestion,
    value: any,
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addFlashcard = () => {
    const newFlashcard: Flashcard = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    setFlashcards([...flashcards, newFlashcard]);
  };

  const updateFlashcard = (
    index: number,
    field: keyof Flashcard,
    value: string,
  ) => {
    const updated = [...flashcards];
    updated[index] = { ...updated[index], [field]: value };
    setFlashcards(updated);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Podaj tytuł");
      return;
    }

    if (type === "quiz") {
      if (questions.length === 0) {
        toast.error("Dodaj przynajmniej jedno pytanie");
        return;
      }
      const quizSet: QuizSet = {
        id: `custom-${Date.now()}`,
        title,
        description,
        questions,
        createdAt: new Date().toISOString(),
      };
      saveQuizSet(quizSet);
      toast.success("Zapisano zestaw quizu!");
      router.push("/quiz");
    } else {
      if (flashcards.length === 0) {
        toast.error("Dodaj przynajmniej jedną fiszkę");
        return;
      }
      const flashcardSet: FlashcardSet = {
        id: `custom-${Date.now()}`,
        title,
        description,
        flashcards,
        createdAt: new Date().toISOString(),
      };
      saveFlashcardSet(flashcardSet);
      toast.success("Zapisano zestaw fiszek!");
      router.push("/fiszki");
    }
  };

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error("Podaj tytuł");
      return;
    }

    if (type === "quiz") {
      if (questions.length === 0) {
        toast.error("Dodaj przynajmniej jedno pytanie");
        return;
      }
      const quizSet: QuizSet = {
        id: `custom-${Date.now()}`,
        title,
        description,
        questions,
        createdAt: new Date().toISOString(),
      };
      onPublish(quizSet);
    } else {
      if (flashcards.length === 0) {
        toast.error("Dodaj przynajmniej jedną fiszkę");
        return;
      }
      const flashcardSet: FlashcardSet = {
        id: `custom-${Date.now()}`,
        title,
        description,
        flashcards,
        createdAt: new Date().toISOString(),
      };
      onPublish(flashcardSet);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Utwórz nowy zestaw</h2>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Typ zestawu</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "quiz" | "flashcard")}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
        >
          <option value="quiz">Quiz</option>
          <option value="flashcard">Fiszki</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Tytuł</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          placeholder="Tytuł zestawu"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Opis (opcjonalny)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          placeholder="Krótki opis"
        />
      </div>

      {type === "quiz" ? (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Pytania</h3>
          {questions.map((q, index) => (
            <div key={q.id} className="mb-6 p-4 bg-gray-700 rounded">
              <input
                type="text"
                placeholder="Pytanie"
                value={q.question}
                onChange={(e) =>
                  updateQuestion(index, "question", e.target.value)
                }
                className="w-full p-2 mb-2 bg-gray-600 border border-gray-500 rounded text-white"
              />
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center mb-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctIndex === optIndex}
                    onChange={() =>
                      updateQuestion(index, "correctIndex", optIndex)
                    }
                    className="mr-2"
                  />
                  <input
                    type="text"
                    placeholder={`Opcja ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...q.options];
                      newOptions[optIndex] = e.target.value;
                      updateQuestion(index, "options", newOptions);
                    }}
                    className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-white"
                  />
                </div>
              ))}
              <input
                type="text"
                placeholder="Wyjaśnienie (opcjonalne)"
                value={q.explanation || ""}
                onChange={(e) =>
                  updateQuestion(index, "explanation", e.target.value)
                }
                className="w-full p-2 mt-2 bg-gray-600 border border-gray-500 rounded text-white"
              />
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
          >
            Dodaj pytanie
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Fiszki</h3>
          {flashcards.map((f, index) => (
            <div key={f.id} className="mb-4 p-4 bg-gray-700 rounded">
              <input
                type="text"
                placeholder="Pytanie"
                value={f.question}
                onChange={(e) =>
                  updateFlashcard(index, "question", e.target.value)
                }
                className="w-full p-2 mb-2 bg-gray-600 border border-gray-500 rounded text-white"
              />
              <textarea
                placeholder="Odpowiedź"
                value={f.answer}
                onChange={(e) =>
                  updateFlashcard(index, "answer", e.target.value)
                }
                className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
              />
            </div>
          ))}
          <button
            onClick={addFlashcard}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
          >
            Dodaj fiszkę
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-bold"
        >
          Zapisz zestaw
        </button>
        <button
          onClick={handlePublish}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-bold"
        >
          Opublikuj zestaw
        </button>
      </div>
    </div>
  );
}
