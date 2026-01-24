"use client";

import { saveQuizSet } from "@/lib/storage";
import { QuizSet } from "@/types/quiz";
import { useState } from "react";

interface QuizImportProps {
  onImport: (quiz: QuizSet) => void;
  onSave?: () => void;
}

export default function QuizImport({ onImport, onSave }: QuizImportProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('JSON musi zawierać pole "questions" z tablicą pytań');
      }

      parsed.questions.forEach((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(
            `Pytanie ${index + 1} musi mieć "question" oraz "options" (min. 2)`,
          );
        }
        if (
          typeof q.correctIndex !== "number" ||
          q.correctIndex < 0 ||
          q.correctIndex >= q.options.length
        ) {
          throw new Error(
            `Pytanie ${index + 1} ma niepoprawne "correctIndex" (0..${q.options.length - 1})`,
          );
        }
      });

      onImport(parsed);
      setJsonInput("");
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nieprawidłowy format JSON",
      );
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('JSON musi zawierać pole "questions" z tablicą pytań');
      }

      parsed.questions.forEach((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(
            `Pytanie ${index + 1} musi mieć "question" oraz "options" (min. 2)`,
          );
        }
        if (
          typeof q.correctIndex !== "number" ||
          q.correctIndex < 0 ||
          q.correctIndex >= q.options.length
        ) {
          throw new Error(
            `Pytanie ${index + 1} ma niepoprawne "correctIndex" (0..${q.options.length - 1})`,
          );
        }
      });

      const setToSave: QuizSet = {
        id: parsed.id || `quiz-set-${Date.now()}`,
        title: parsed.title || "Zapisany quiz",
        description: parsed.description,
        questions: parsed.questions,
        createdAt: parsed.createdAt || new Date().toISOString(),
      };

      saveQuizSet(setToSave);
      setJsonInput("");
      setError("");
      alert("Quiz został zapisany!");
      onSave?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nieprawidłowy format JSON",
      );
    }
  };

  const exampleJson: QuizSet = {
    id: "example-quiz",
    title: "Quiz: Podstawy React",
    description: "Krótki quiz sprawdzający podstawy",
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "1",
        question: "Co zwraca komponent React?",
        options: ["HTML", "JSX", "CSS", "SQL"],
        correctIndex: 1,
        explanation:
          "Komponenty zwykle zwracają JSX, które React renderuje do DOM.",
        category: "React",
        difficulty: "easy",
      },
      {
        id: "2",
        question: "Do czego służy useState?",
        options: [
          "Do pobierania danych z API",
          "Do zarządzania stanem w komponencie",
          "Do routingu",
          "Do stylowania",
        ],
        correctIndex: 1,
        explanation:
          "useState pozwala trzymać i zmieniać stan wewnątrz komponentu.",
        category: "React",
        difficulty: "easy",
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">
          Importuj quiz z JSON
        </h2>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Wklej JSON:</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 font-mono text-sm focus:outline-none focus:border-primary-500 transition-colors"
            placeholder={JSON.stringify(exampleJson, null, 2)}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleImport}
            disabled={!jsonInput.trim()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Importuj quiz
          </button>
          <button
            onClick={handleSave}
            disabled={!jsonInput.trim()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Zapisz quiz
          </button>
          <button
            onClick={() => {
              setJsonInput(JSON.stringify(exampleJson, null, 2));
              setError("");
            }}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Załaduj przykład
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-primary-400 mb-2">
            Format JSON:
          </h3>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>
              <code className="text-primary-300">title</code> - tytuł quizu
              (wymagany)
            </li>
            <li>
              <code className="text-primary-300">description</code> - opis
              (opcjonalny)
            </li>
            <li>
              <code className="text-primary-300">questions</code> - tablica
              pytań (wymagana)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">question</code> - treść pytania
              (wymagana)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">options</code> - odpowiedzi
              (min. 2)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">correctIndex</code> - index
              poprawnej odpowiedzi (0..)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">explanation</code> -
              wyjaśnienie (opcjonalne)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
