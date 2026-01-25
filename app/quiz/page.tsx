"use client";

import QuizImport from "@/components/QuizImport";
import QuizRunner from "@/components/QuizRunner";
import ShareOptions from "@/components/ShareOptions";
import { deleteQuizSet, getQuizSets } from "@/lib/storage";
import { QuizSet } from "@/types/quiz";
import { Play, Plus, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuizPage() {
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [savedSets, setSavedSets] = useState<QuizSet[]>([]);
  const [shareSet, setShareSet] = useState<QuizSet | null>(null);

  // Handle shared data from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get("data");
      if (encodedData) {
        try {
          const decodedBytes = Uint8Array.from(
            atob(decodeURIComponent(encodedData)),
            (c) => c.charCodeAt(0),
          );
          const decodedString = new TextDecoder().decode(decodedBytes);
          const decodedData = JSON.parse(decodedString);
          if (decodedData.questions && Array.isArray(decodedData.questions)) {
            setQuizSet(decodedData);
            setShowImport(false);
            // Clear URL
            window.history.replaceState({}, "", window.location.pathname);
          }
        } catch (err) {
          console.error("Failed to load shared quiz:", err);
        }
      }
    }
  }, []);

  useEffect(() => {
    setSavedSets(getQuizSets());
  }, []);

  const handleImport = (newQuiz: QuizSet) => {
    setQuizSet(newQuiz);
    setShowImport(false);
  };

  const handleLoadSaved = (set: QuizSet) => {
    setQuizSet(set);
    setShowImport(false);
  };

  const handleDeleteSaved = (id: string) => {
    deleteQuizSet(id);
    setSavedSets(getQuizSets());
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-10">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent hover:from-primary-300 hover:to-primary-500 transition-colors"
            aria-label="Flashki - menu główne"
          >
            Flashki
          </Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Quiz</h1>
            <p className="text-gray-400">Pytania wielokrotnego wyboru</p>
          </div>
        </header>

        {quizSet ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {quizSet.title}
              </h2>
              {quizSet.description && (
                <p className="text-gray-400">{quizSet.description}</p>
              )}
            </div>
            <QuizRunner
              questions={quizSet.questions}
              onRestart={() => {
                // no-op for now
              }}
            />
          </div>
        ) : showImport ? (
          <QuizImport
            onImport={handleImport}
            onSave={() => {
              setShowImport(false);
              setSavedSets(getQuizSets());
            }}
          />
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-400">
                  Moje zapisane quizy
                </h2>
                <button
                  onClick={() => setShowImport(true)}
                  className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  title="Dodaj nowy quiz"
                >
                  <Plus size={20} />
                </button>
              </div>
              {savedSets.length === 0 ? (
                <p className="text-gray-400">Brak zapisanych quizów.</p>
              ) : (
                <div className="space-y-4">
                  {savedSets.map((set) => (
                    <div
                      key={set.id}
                      className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3
                            className="text-lg font-semibold text-primary-400 hover:text-primary-300 cursor-pointer transition-colors"
                            onClick={() => handleLoadSaved(set)}
                          >
                            {set.title}
                          </h3>
                          {set.description && (
                            <p className="text-gray-400 text-sm mt-1">
                              {set.description}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-2">
                            {set.questions.length} pytań • Utworzono:{" "}
                            {new Date(set.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 self-end sm:self-start">
                          <button
                            onClick={() => setShareSet(set)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="Udostępnij quiz"
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            onClick={() => handleLoadSaved(set)}
                            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            title="Załaduj quiz"
                          >
                            <Play size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(set.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            title="Usuń quiz"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {shareSet && (
        <ShareOptions
          set={shareSet}
          type="quiz"
          onClose={() => setShareSet(null)}
        />
      )}
    </main>
  );
}
