"use client";

import { Flashcard as FlashcardType } from "@/types/flashcard";
import { useState } from "react";
import Flashcard from "./Flashcard";

interface FlashcardViewerProps {
  flashcards: FlashcardType[];
}

export default function FlashcardViewer({ flashcards }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Brak fiszek do wyświetlenia</p>
        <p className="text-gray-500 mt-2">Zaimportuj fiszki z formatu JSON</p>
      </div>
    );
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === flashcards.length - 1;

  const fireConfetti = async () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const confetti = (await import("canvas-confetti")).default;

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.75 },
      colors: ["#ff6b35", "#ffffff", "#f59e0b"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.7 },
        colors: ["#ff6b35", "#ffffff", "#fbbf24"],
      });
    }, 250);
  };

  const goToPrevious = () => {
    if (isFirst) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const goToNext = () => {
    if (isLast) {
      setIsFinished(true);
      void fireConfetti();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      {isFinished ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center shadow-xl">
            <div className="text-sm text-primary-400 font-semibold mb-3 uppercase tracking-wider">
              Ukończono
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">
              Dobra robota!
            </h3>
            <p className="text-gray-400 mb-8">
              Przerobiłeś cały zestaw fiszek.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFinished(false);
                }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
              >
                Zacznij od nowa
              </button>
              <button
                onClick={() => void fireConfetti()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Jeszcze raz konfetti
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <Flashcard
              key={currentIndex}
              flashcard={flashcards[currentIndex]}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={goToPrevious}
              disabled={isFirst}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 disabled:border-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors border border-gray-700"
            >
              ← Poprzednia
            </button>
            <span className="text-gray-400 font-medium">
              {currentIndex + 1} / {flashcards.length}
            </span>
            <button
              onClick={goToNext}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
            >
              {isLast ? "Zakończ" : "Następna →"}
            </button>
          </div>

          {/* Progress bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
