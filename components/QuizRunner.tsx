"use client";

import { QuizQuestion } from "@/types/quiz";
import { useEffect, useMemo, useState } from "react";

type AnswerRecord = {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
};

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onRestart?: () => void;
}

export default function QuizRunner({ questions, onRestart }: QuizRunnerProps) {
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const current = questions[currentIndex];

  const correctCount = useMemo(
    () => answers.filter((a) => a.isCorrect).length,
    [answers],
  );

  const isLast = currentIndex === total - 1;

  const fireConfetti = async () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const confetti = (await import("canvas-confetti")).default;

    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.75 },
      colors: ["#ff6b35", "#ffffff", "#fbbf24"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 110,
        origin: { y: 0.7 },
        colors: ["#ff6b35", "#ffffff", "#f59e0b"],
      });
    }, 250);
  };

  const resetForNext = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);
  };

  const submit = () => {
    if (selectedIndex === null) return;
    if (isSubmitted) return;

    const isCorrect = selectedIndex === current.correctIndex;

    setAnswers((prev) => [
      ...prev,
      { questionId: current.id, selectedIndex, isCorrect },
    ]);
    setIsSubmitted(true);
  };

  const next = () => {
    if (!isSubmitted) return;

    if (isLast) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    resetForNext();
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsSubmitted(false);
    setAnswers([]);
    setIsFinished(false);
    onRestart?.();
  };

  useEffect(() => {
    if (!isFinished) return;
    if (correctCount === total && total > 0) {
      void fireConfetti();
    }
  }, [isFinished, correctCount, total]);

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Brak pytań do wyświetlenia</p>
      </div>
    );
  }

  if (isFinished) {
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const byId = new Map(questions.map((q) => [q.id, q] as const));
    const wrong = answers.filter((a) => !a.isCorrect);

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
          <div className="text-sm text-primary-400 font-semibold mb-3 uppercase tracking-wider">
            Podsumowanie
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Koniec quizu</h3>
          <p className="text-gray-400 mb-6">
            Wynik:{" "}
            <span className="text-white font-semibold">{correctCount}</span>/
            {total} ({percent}%)
          </p>

          {correctCount === total ? (
            <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500 rounded-xl text-primary-200">
              Max wynik! Konfetti leci.
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-xl text-gray-300">
              Możesz powtórzyć quiz, żeby dobić do maksa.
            </div>
          )}

          {wrong.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">
                Błędne odpowiedzi
              </h4>
              <div className="space-y-3">
                {wrong.map((a) => {
                  const q = byId.get(a.questionId);
                  if (!q) return null;
                  return (
                    <div
                      key={a.questionId}
                      className="p-4 rounded-xl bg-gray-900 border border-gray-700"
                    >
                      <div className="text-gray-200 font-medium mb-2">
                        {q.question}
                      </div>
                      <div className="text-sm text-gray-400">
                        Twoja:{" "}
                        <span className="text-white">
                          {q.options[a.selectedIndex] ?? "-"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Poprawna:{" "}
                        <span className="text-primary-300">
                          {q.options[q.correctIndex]}
                        </span>
                      </div>
                      {q.explanation && (
                        <div className="text-sm text-gray-400 mt-2">
                          Wyjaśnienie: {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={restart}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
            >
              Powtórz quiz
            </button>
            {correctCount === total && (
              <button
                onClick={() => void fireConfetti()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Jeszcze raz konfetti
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentIndex + 1) / total) * 100);
  const selected = selectedIndex;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-primary-400 font-semibold uppercase tracking-wider">
              Pytanie {currentIndex + 1} / {total}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
              {current.question}
            </h2>
            {current.category && (
              <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm">
                {current.category}
              </div>
            )}
          </div>
          <div className="text-right text-sm text-gray-400">
            Punkty:{" "}
            <span className="text-white font-semibold">{correctCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          {current.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === current.correctIndex;

            const base =
              "w-full text-left px-4 py-3 rounded-xl border transition-colors";

            let cls =
              "bg-gray-900 border-gray-700 hover:border-primary-500 text-gray-100";

            if (isSubmitted) {
              if (isCorrect) {
                cls = "bg-green-900/30 border-green-500 text-green-100";
              } else if (isSelected) {
                cls = "bg-red-900/30 border-red-500 text-red-100";
              } else {
                cls = "bg-gray-900 border-gray-700 text-gray-300";
              }
            } else if (isSelected) {
              cls = "bg-primary-500/10 border-primary-500 text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  if (isSubmitted) return;
                  setSelectedIndex(idx);
                }}
                className={`${base} ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isSubmitted && current.explanation && (
          <div className="mt-5 p-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-300">
            <span className="text-primary-300 font-semibold">Wyjaśnienie:</span>{" "}
            {current.explanation}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-400">Postęp: {progress}%</div>
          <div className="flex gap-3">
            {!isSubmitted ? (
              <button
                onClick={submit}
                disabled={selectedIndex === null}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                Zatwierdź
              </button>
            ) : (
              <button
                onClick={next}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
              >
                {isLast ? "Zakończ" : "Dalej"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
