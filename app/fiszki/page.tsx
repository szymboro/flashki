"use client";

import FlashcardViewer from "@/components/FlashcardViewer";
import JsonImport from "@/components/JsonImport";
import { deleteFlashcardSet, getFlashcardSets } from "@/lib/storage";
import { FlashcardSet } from "@/types/flashcard";
import { Edit, Plus, Repeat, Shuffle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FiszkiPage() {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showSaved, setShowSaved] = useState(true);
  const [savedSets, setSavedSets] = useState<FlashcardSet[]>([]);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editedFlashcards, setEditedFlashcards] = useState<
    FlashcardSet["flashcards"]
  >([]);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<
    FlashcardSet["flashcards"]
  >([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    if (!shuffleEnabled && flashcardSet) {
      setShuffledFlashcards(shuffleArray(flashcardSet.flashcards));
    }
    setShuffleEnabled(!shuffleEnabled);
  };

  useEffect(() => {
    setSavedSets(getFlashcardSets());
  }, []);

  useEffect(() => {
    if (flashcardSet && shuffleEnabled) {
      setShuffledFlashcards(shuffleArray(flashcardSet.flashcards));
    }
  }, [flashcardSet, shuffleEnabled]);

  const handleImport = (newSet: FlashcardSet) => {
    setFlashcardSet(newSet);
    setShowImport(false);
    setShowSaved(false);
  };

  const handleLoadSaved = (set: FlashcardSet) => {
    setFlashcardSet(set);
    setShowImport(false);
    setShowSaved(false);
  };

  const handleDeleteSaved = (id: string) => {
    deleteFlashcardSet(id);
    setSavedSets(getFlashcardSets());
  };

  const handleFlashcardsChange = (
    updatedFlashcards: FlashcardSet["flashcards"],
  ) => {
    if (flashcardSet) {
      const updatedSet = { ...flashcardSet, flashcards: updatedFlashcards };
      setFlashcardSet(updatedSet);
      // Zaktualizuj w localStorage jeśli to zapisany set
      const savedSets = getFlashcardSets();
      const existingIndex = savedSets.findIndex(
        (s) => s.id === flashcardSet.id,
      );
      if (existingIndex >= 0) {
        savedSets[existingIndex] = updatedSet;
        localStorage.setItem(
          "flashki_flashcard_sets",
          JSON.stringify(savedSets),
        );
        setSavedSets(savedSets);
      }
    }
  };

  const startEditing = (set: FlashcardSet) => {
    setEditingSetId(set.id);
    setEditedFlashcards([...set.flashcards]);
  };

  const cancelEditing = () => {
    setEditingSetId(null);
    setEditedFlashcards([]);
  };

  const saveEditing = () => {
    if (editingSetId) {
      const updatedSets = savedSets.map((set) =>
        set.id === editingSetId
          ? { ...set, flashcards: editedFlashcards }
          : set,
      );
      localStorage.setItem(
        "flashki_flashcard_sets",
        JSON.stringify(updatedSets),
      );
      setSavedSets(updatedSets);
      setEditingSetId(null);
      setEditedFlashcards([]);
    }
  };

  const addFlashcard = () => {
    const newId =
      Math.max(...editedFlashcards.map((f) => parseInt(f.id) || 0), 0) + 1;
    const newFlashcard: FlashcardSet["flashcards"][0] = {
      id: newId.toString(),
      question: "Nowe pytanie",
      answer: "Nowa odpowiedź",
    };
    setEditedFlashcards([...editedFlashcards, newFlashcard]);
  };

  const deleteFlashcard = (index: number) => {
    setEditedFlashcards(editedFlashcards.filter((_, i) => i !== index));
  };

  const updateFlashcard = (
    index: number,
    field: keyof FlashcardSet["flashcards"][0],
    value: string,
  ) => {
    const updated = [...editedFlashcards];
    updated[index] = { ...updated[index], [field]: value };
    setEditedFlashcards(updated);
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Fiszki
            </h1>
            <p className="text-gray-400">Nauka przez odwracanie kart</p>
          </div>
        </header>

        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => {
              setShowImport(false);
              setShowSaved(true);
              setSavedSets(getFlashcardSets());
            }}
            className={`px-6 py-3 rounded-lg transition-colors ${
              showSaved && !flashcardSet
                ? "bg-primary-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Moje fiszki
          </button>
        </div>

        {showImport ? (
          <JsonImport
            onImport={handleImport}
            onSave={() => {
              setShowImport(false);
              setShowSaved(true);
              setSavedSets(getFlashcardSets());
            }}
          />
        ) : showSaved ? (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-400">
                  Moje zapisane zestawy fiszek
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
                        ? "Wyłącz mieszanie fiszek"
                        : "Włącz mieszanie fiszek"
                    }
                  >
                    {shuffleEnabled ? (
                      <Shuffle size={20} />
                    ) : (
                      <Repeat size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowImport(true);
                      setShowSaved(false);
                    }}
                    className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    title="Dodaj nowy zestaw fiszek"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              {savedSets.length === 0 ? (
                <p className="text-gray-400">
                  Brak zapisanych zestawów fiszek.
                </p>
              ) : (
                <div className="space-y-4">
                  {savedSets.map((set) =>
                    editingSetId === set.id ? (
                      // Tryb edycji
                      <div
                        key={set.id}
                        className="bg-gray-900 rounded-lg p-6 border border-primary-500"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-primary-400">
                            Edycja: {set.title} ({editedFlashcards.length}{" "}
                            fiszek)
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                            >
                              Anuluj
                            </button>
                            <button
                              onClick={saveEditing}
                              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
                            >
                              Zapisz zmiany
                            </button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {editedFlashcards.map((flashcard, index) => (
                            <div
                              key={flashcard.id}
                              className="bg-gray-800 rounded-lg p-4 border border-gray-600"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-sm text-gray-400 font-medium">
                                  Fiszka #{index + 1} (ID: {flashcard.id})
                                </span>
                                <button
                                  onClick={() => deleteFlashcard(index)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                >
                                  Usuń
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm text-gray-300 mb-1">
                                    Pytanie:
                                  </label>
                                  <textarea
                                    value={flashcard.question}
                                    onChange={(e) =>
                                      updateFlashcard(
                                        index,
                                        "question",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-primary-500"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-1">
                                    Odpowiedź:
                                  </label>
                                  <textarea
                                    value={flashcard.answer}
                                    onChange={(e) =>
                                      updateFlashcard(
                                        index,
                                        "answer",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-primary-500"
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                  <label className="block text-sm text-gray-300 mb-1">
                                    Kategoria:
                                  </label>
                                  <input
                                    type="text"
                                    value={flashcard.category || ""}
                                    onChange={(e) =>
                                      updateFlashcard(
                                        index,
                                        "category",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-300 mb-1">
                                    Trudność:
                                  </label>
                                  <select
                                    value={flashcard.difficulty || ""}
                                    onChange={(e) =>
                                      updateFlashcard(
                                        index,
                                        "difficulty",
                                        e.target.value as any,
                                      )
                                    }
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-primary-500"
                                  >
                                    <option value="">Brak</option>
                                    <option value="easy">Łatwy</option>
                                    <option value="medium">Średni</option>
                                    <option value="hard">Trudny</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-center pt-4">
                            <button
                              onClick={addFlashcard}
                              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              + Dodaj nową fiszkę
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Normalny widok
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
                              {set.flashcards.length} fiszek • Utworzono:{" "}
                              {new Date(set.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 self-end sm:self-start">
                            <button
                              onClick={() => startEditing(set)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              title="Edytuj zestaw"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteSaved(set.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              title="Usuń zestaw"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        ) : flashcardSet ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {flashcardSet.title}
              </h2>
              {flashcardSet.description && (
                <p className="text-gray-400">{flashcardSet.description}</p>
              )}
            </div>
            <FlashcardViewer
              flashcards={
                shuffleEnabled ? shuffledFlashcards : flashcardSet.flashcards
              }
            />
          </div>
        ) : (
          <JsonImport onImport={handleImport} />
        )}
      </div>
    </main>
  );
}
