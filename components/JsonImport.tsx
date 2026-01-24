"use client";

import { saveFlashcardSet } from "@/lib/storage";
import { FlashcardSet } from "@/types/flashcard";
import { useState } from "react";

interface JsonImportProps {
  onImport: (flashcards: FlashcardSet) => void;
  onSave?: () => void;
}

export default function JsonImport({ onImport, onSave }: JsonImportProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Validate structure
      if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
        throw new Error(
          'JSON musi zawierać pole "flashcards" z tablicą fiszek',
        );
      }

      // Validate each flashcard
      parsed.flashcards.forEach((card: any, index: number) => {
        if (!card.question || !card.answer) {
          throw new Error(
            `Fiszka ${index + 1} musi zawierać pola "question" i "answer"`,
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

      // Validate structure
      if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
        throw new Error(
          'JSON musi zawierać pole "flashcards" z tablicą fiszek',
        );
      }

      // Validate each flashcard
      parsed.flashcards.forEach((card: any, index: number) => {
        if (!card.question || !card.answer) {
          throw new Error(
            `Fiszka ${index + 1} musi zawierać pola "question" i "answer"`,
          );
        }
      });

      const setToSave: FlashcardSet = {
        id: parsed.id || `flashcard-set-${Date.now()}`,
        title: parsed.title || "Zapisany zestaw fiszek",
        description: parsed.description,
        flashcards: parsed.flashcards,
        createdAt: parsed.createdAt || new Date().toISOString(),
      };

      saveFlashcardSet(setToSave);
      setJsonInput("");
      setError("");
      alert("Zestaw fiszek został zapisany!");
      onSave?.();

      // Przejdź do "Moje zapisane" - to będzie obsłużone przez rodzica
      if (window.location.pathname === "/fiszki") {
        window.history.replaceState(null, "", "/fiszki?view=saved");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nieprawidłowy format JSON",
      );
    }
  };

  const exampleJson = {
    id: "example-flashcards",
    title: "Przykładowy zestaw fiszek",
    description: "Opis zestawu",
    createdAt: new Date().toISOString(),
    flashcards: [
      {
        id: "1",
        question: "Co to jest React?",
        answer: "Biblioteka JavaScript do tworzenia interfejsów użytkownika",
        category: "Frontend",
        difficulty: "easy",
      },
      {
        id: "2",
        question: "Co to jest TypeScript?",
        answer: "Nadzbiór JavaScript z typowaniem statycznym",
        category: "Języki programowania",
        difficulty: "medium",
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">
          Importuj fiszki z JSON
        </h2>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">
            Wklej JSON z fiszkami:
          </label>
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
            Importuj fiszki
          </button>
          <button
            onClick={handleSave}
            disabled={!jsonInput.trim()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Zapisz fiszki
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
              <code className="text-primary-300">title</code> - tytuł zestawu
              (wymagany)
            </li>
            <li>
              <code className="text-primary-300">description</code> - opis
              zestawu (opcjonalny)
            </li>
            <li>
              <code className="text-primary-300">flashcards</code> - tablica
              fiszek (wymagana)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">id</code> - unikalny
              identyfikator (wymagany)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">question</code> - pytanie
              (wymagane)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">answer</code> - odpowiedź
              (wymagana)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">category</code> - kategoria
              (opcjonalna)
            </li>
            <li className="ml-6">
              <code className="text-primary-300">difficulty</code> - poziom
              trudności: easy/medium/hard (opcjonalny)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
