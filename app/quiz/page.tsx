"use client";

import QuizImport from "@/components/QuizImport";
import QuizRunner from "@/components/QuizRunner";
import { deleteQuizSet, getQuizSets } from "@/lib/storage";
import { QuizSet } from "@/types/quiz";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuizPage() {
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showSaved, setShowSaved] = useState(true);
  const [savedSets, setSavedSets] = useState<QuizSet[]>([]);

  useEffect(() => {
    setSavedSets(getQuizSets());
  }, []);

  const handleImport = (newQuiz: QuizSet) => {
    setQuizSet(newQuiz);
    setShowImport(false);
    setShowSaved(false);
  };

  const handleLoadSaved = (set: QuizSet) => {
    setQuizSet(set);
    setShowImport(false);
    setShowSaved(false);
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
            className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent hover:from-primary-300 hover:to-primary-500 transition-colors"
            aria-label="Flashki - menu główne"
          >
            Flashki
          </Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Quiz</h1>
            <p className="text-gray-400">Pytania wielokrotnego wyboru</p>
          </div>
        </header>

        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => {
              setShowImport(false);
              setShowSaved(true);
              setSavedSets(getQuizSets());
            }}
            className={`px-6 py-3 rounded-lg transition-colors ${
              showSaved && !quizSet
                ? "bg-primary-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Moje quizy
          </button>
          <button
            onClick={() => {
              setShowImport(false);
              setShowSaved(false);
            }}
            className={`px-6 py-3 rounded-lg transition-colors ${
              !showImport && !showSaved && quizSet
                ? "bg-primary-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Quiz
          </button>
        </div>

        {showImport ? (
          <QuizImport
            onImport={handleImport}
            onSave={() => {
              setShowImport(false);
              setShowSaved(true);
              setSavedSets(getQuizSets());
            }}
          />
        ) : showSaved ? (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-400">
                  Moje zapisane quizy
                </h2>
                <button
                  onClick={() => {
                    setShowImport(true);
                    setShowSaved(false);
                  }}
                  className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  title="Dodaj nowy quiz"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadSaved(set)}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
                          >
                            Załaduj
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(set.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                          >
                            Usuń
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : quizSet ? (
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
        ) : (
          <QuizImport onImport={handleImport} />
        )}
      </div>
    </main>
  );
}
