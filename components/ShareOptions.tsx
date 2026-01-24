"use client";

import { exportFlashcardSet, exportQuizSet } from "@/lib/storage";
import { FlashcardSet } from "@/types/flashcard";
import { QuizSet } from "@/types/quiz";
import { Copy, Download } from "lucide-react";
import { useState } from "react";

interface ShareOptionsProps<T extends FlashcardSet | QuizSet> {
  set: T;
  type: T extends FlashcardSet ? "flashcards" : "quiz";
  onClose: () => void;
}

export default function ShareOptions<T extends FlashcardSet | QuizSet>({
  set,
  type,
  onClose,
}: ShareOptionsProps<T>) {
  const [copied, setCopied] = useState(false);

  const isFlashcardSet = type === "flashcards";
  const exportData = isFlashcardSet
    ? exportFlashcardSet(set as FlashcardSet)
    : exportQuizSet(set as QuizSet);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${set.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-[#000000ab] flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Udostępnij {type === "flashcards" ? "fiszki" : "quiz"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Eksport - Pobierz plik */}
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <Download size={20} className="text-green-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-300">Pobierz jako plik JSON</p>
              <p className="text-xs text-gray-500">
                Zapisz plik i udostępnij go
              </p>
            </div>
            <button
              onClick={downloadFile}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              Pobierz
            </button>
          </div>

          {/* Eksport - Kopiuj JSON */}
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <Copy size={20} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-300">Kopiuj dane JSON</p>
              <p className="text-xs text-gray-500">
                Skopiuj i wklej gdziekolwiek
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(exportData)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              {copied ? "Skopiowano!" : "Kopiuj"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
