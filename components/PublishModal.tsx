"use client";

import { saveFlashcardSet, saveQuizSet } from "@/lib/storage";
import { FlashcardSet } from "@/types/flashcard";
import { QuizSet } from "@/types/quiz";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PublishModalProps {
  data: QuizSet | FlashcardSet;
  onClose: () => void;
}

export default function PublishModal({ data, onClose }: PublishModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if ("questions" in data) {
      saveQuizSet(data as QuizSet);
      toast.success("Zapisano zestaw quizu!");
      onClose();
      router.push("/quiz");
    } else {
      saveFlashcardSet(data as FlashcardSet);
      toast.success("Zapisano zestaw fiszek!");
      onClose();
      router.push("/fiszki");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Opublikuj zestaw</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-300 mb-4">
          Twój zestaw jest gotowy! Skopiuj poniższy JSON i utwórz Pull Request
          na GitHub, aby dodać go do aplikacji.
        </p>

        <div className="mb-4 flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Zapisz zestaw
          </button>
          <button
            onClick={copyToClipboard}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
          >
            {copied ? "Skopiowano!" : "Kopiuj JSON"}
          </button>
          <button
            onClick={downloadJson}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Pobierz jako plik
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-2">
            Instrukcja publikacji:
          </h3>
          <ol className="text-gray-300 list-decimal list-inside space-y-1">
            <li>
              Utwórz nowy plik w folderze{" "}
              <code className="bg-gray-700 px-1 rounded">materials/</code> o
              nazwie{" "}
              <code className="bg-gray-700 px-1 rounded">{data.id}.json</code>
            </li>
            <li>Wklej skopiowany JSON</li>
            <li>
              Utwórz Pull Request z opisem: "Dodanie nowego zestawu:{" "}
              {data.title}"
            </li>
          </ol>
        </div>

        <div className="bg-gray-900 p-4 rounded border border-gray-600">
          <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}
