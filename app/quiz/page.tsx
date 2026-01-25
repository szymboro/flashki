"use client";

import QuizImport from "@/components/QuizImport";
import QuizRunner from "@/components/QuizRunner";
import ShareOptions from "@/components/ShareOptions";
import { deleteQuizSet, getQuizSets } from "@/lib/storage";
import { QuizSet } from "@/types/quiz";
import { Play, Plus, Repeat, Share2, Shuffle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function QuizPage() {
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [savedSets, setSavedSets] = useState<QuizSet[]>([]);
  const [shareSet, setShareSet] = useState<QuizSet | null>(null);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchAvailableQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes");
        if (response.ok) {
          const quizzes = await response.json();
          setAvailableQuizzes(quizzes);
        }
      } catch (error) {
        console.error("Failed to fetch available quizzes:", error);
      }
    };

    fetchAvailableQuizzes();
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    setShuffleEnabled(!shuffleEnabled);
  };

  const processedQuestions = useMemo(() => {
    if (!quizSet) return [];
    let questions = [...quizSet.questions];
    if (shuffleEnabled) {
      questions = shuffleArray(questions);
    }
    if (questionLimit && questionLimit < questions.length) {
      questions = questions.slice(0, questionLimit);
    }
    return questions;
  }, [quizSet, shuffleEnabled, questionLimit]);

  const handleImport = (newQuiz: QuizSet) => {
    setQuizSet(newQuiz);
    setShowImport(false);
  };

  const handleLoadSaved = (set: QuizSet) => {
    setQuizSet(set);
    setShowImport(false);
  };

  const handleLoadAvailable = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (response.ok) {
        const quizData = await response.json();
        setQuizSet(quizData);
        setShowImport(false);
      }
    } catch (error) {
      console.error("Failed to load quiz:", error);
    }
  };

  const handleDeleteSaved = (id: string) => {
    deleteQuizSet(id);
    setSavedSets(getQuizSets());
  };

  return (
    <main className="p-4 md:p-8">
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
              questions={processedQuestions}
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
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 rounded-lg transition-colors ${
                      shuffleEnabled
                        ? "bg-primary-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    title={
                      shuffleEnabled
                        ? "Wyłącz mieszanie pytań"
                        : "Włącz mieszanie pytań"
                    }
                  >
                    {shuffleEnabled ? (
                      <Shuffle size={20} />
                    ) : (
                      <Repeat size={20} />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="limit-questions"
                      checked={questionLimit !== null}
                      onChange={(e) =>
                        setQuestionLimit(e.target.checked ? 10 : null)
                      }
                      className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label
                      htmlFor="limit-questions"
                      className="text-gray-300 text-sm whitespace-nowrap"
                    >
                      # pytań
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={questionLimit || ""}
                      onChange={(e) =>
                        setQuestionLimit(
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      disabled={questionLimit === null}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-gray-100 text-sm focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed w-14 sm:w-16"
                      placeholder="10"
                    />
                  </div>
                  <button
                    onClick={() => setShowImport(true)}
                    className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    title="Dodaj nowy quiz"
                  >
                    <Plus size={20} />
                  </button>
                </div>
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

              {savedSets.length > 0 && (
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-blue-300 font-semibold mb-2">
                        Informacja o zapisanych quizach
                      </h4>
                      <p className="text-blue-200 text-sm mb-3">
                        Twoje zestawy quizów są zapisane w pamięci przeglądarki
                        (localStorage). Mogą zostać usunięte przy wyczyszczeniu
                        danych przeglądarki. Kliknij ikonę udostępnienia i
                        zapisz jako json, aby mieć kopię zapasową.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {availableQuizzes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-primary-400 mb-4">
                  Dostępne quizy
                </h3>
                <div className="space-y-4">
                  {availableQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3
                            className="text-lg font-semibold text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                            onClick={() => handleLoadAvailable(quiz.id)}
                          >
                            {quiz.title}
                          </h3>
                          {quiz.description && (
                            <p className="text-gray-400 text-sm mt-1">
                              {quiz.description}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-2">
                            {quiz.questionCount} pytań
                          </p>
                        </div>
                        <button
                          onClick={() => handleLoadAvailable(quiz.id)}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors self-end sm:self-start"
                          title="Załaduj quiz"
                        >
                          <Play size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
