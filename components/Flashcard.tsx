"use client";

import { Flashcard as FlashcardType } from "@/types/flashcard";
import { useState } from "react";

interface FlashcardProps {
  flashcard: FlashcardType;
}

export default function Flashcard({ flashcard }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full max-w-2xl mx-auto cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-96 transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden bg-gray-800 border-2 border-primary-500 rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl ${isFlipped ? "opacity-0" : "opacity-100"}`}
        >
          <div className="text-sm text-primary-400 font-semibold mb-4 uppercase tracking-wider">
            Pytanie
          </div>
          <div className="text-2xl md:text-3xl text-center font-medium">
            {flashcard.question}
          </div>
          {flashcard.category && (
            <div className="mt-6 px-4 py-2 bg-gray-700 rounded-full text-sm text-gray-300">
              {flashcard.category}
            </div>
          )}
          <div className="absolute bottom-6 text-sm text-gray-500">
            Kliknij aby zobaczyć odpowiedź
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 backface-hidden bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl ${isFlipped ? "opacity-100 rotate-y-180" : "opacity-0"}`}
        >
          <div className="text-sm text-primary-100 font-semibold mb-4 uppercase tracking-wider">
            Odpowiedź
          </div>
          <div className="text-2xl md:text-3xl text-center font-medium text-white">
            {flashcard.answer}
          </div>
          {flashcard.difficulty && (
            <div className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
              Poziom:{" "}
              {flashcard.difficulty === "easy"
                ? "Łatwy"
                : flashcard.difficulty === "medium"
                  ? "Średni"
                  : "Trudny"}
            </div>
          )}
          <div className="absolute bottom-6 text-sm text-primary-100">
            Kliknij aby wrócić
          </div>
        </div>
      </div>
    </div>
  );
}
