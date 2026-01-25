"use client";

import CreateSetEditor from "@/components/CreateSetEditor";
import PublishModal from "@/components/PublishModal";
import { FlashcardSet } from "@/types/flashcard";
import { QuizSet } from "@/types/quiz";
import Link from "next/link";
import { useState } from "react";

export default function CreatePage() {
  const [publishData, setPublishData] = useState<QuizSet | FlashcardSet | null>(
    null,
  );

  const handlePublish = (data: QuizSet | FlashcardSet) => {
    setPublishData(data);
  };

  const closeModal = () => {
    setPublishData(null);
  };

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center my-6">
          <Link href="/">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-3 cursor-pointer hover:opacity-80 transition-opacity">
              Flashki
            </h1>
          </Link>
          <p className="text-gray-400 text-lg">
            Pomagamy studentom przejść od nauki do flaszki
          </p>
        </header>

        <CreateSetEditor onPublish={handlePublish} />

        {publishData && (
          <PublishModal data={publishData} onClose={closeModal} />
        )}
      </div>
    </main>
  );
}
