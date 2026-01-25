"use client";

import { saveFlashcardSet } from "@/lib/storage";
import { FlashcardSet } from "@/types/flashcard";
import { useState } from "react";
import toast from "react-hot-toast";

interface JsonImportProps {
  onImport: (flashcards: FlashcardSet) => void;
  onSave?: () => void;
}

export default function JsonImport({ onImport, onSave }: JsonImportProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      setError("");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setJsonInput(content);
          setError("");
        };
        reader.readAsText(file);
      } else {
        setError("Proszę wybrać plik JSON");
      }
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
      toast.success("Zestaw fiszek został zapisany!");
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

  const dropZoneClassName =
    "relative border-2 border-dashed rounded-lg transition-colors " +
    (isDragOver
      ? "border-primary-500 bg-primary-500/10"
      : "border-gray-700 hover:border-gray-600");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">
          Importuj fiszki z JSON
        </h2>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">
            Wklej JSON z fiszkami lub wybierz plik:
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={dropZoneClassName}
          >
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 p-4 bg-gray-900 border-0 rounded-lg text-gray-100 font-mono text-sm focus:outline-none transition-colors resize-none"
              placeholder={JSON.stringify(exampleJson, null, 2)}
            />
            {isDragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-500/20 rounded-lg pointer-events-none">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-primary-400 font-semibold">
                    Upuść plik JSON tutaj
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Wybierz plik JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-400">
                lub przeciągnij i upuść plik tutaj
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={!jsonInput.trim()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
            >
              Zapisz fiszki
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

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
