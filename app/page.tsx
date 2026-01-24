import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center my-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-3">
            Flashki
          </h1>
          <p className="text-gray-400 text-lg">
            Pomagamy studentom przejść od nauki do flaszki
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/fiszki"
            className="group bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-primary-500 transition-colors shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-primary-200 transition-colors">
              Fiszki
            </h2>
            <p className="text-gray-400">
              Klikasz kartę → obrót → odpowiedź. Na końcu konfetti i
              zakończenie.
            </p>
            <div className="mt-6 text-primary-300 font-semibold">
              Otwórz fiszki →
            </div>
          </Link>

          <Link
            href="/quiz"
            className="group bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-primary-500 transition-colors shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-primary-200 transition-colors">
              Quiz
            </h2>
            <p className="text-gray-400">
              Pytania wielokrotnego wyboru + wynik, podsumowanie i powtórka.
              Przy max wyniku: konfetti.
            </p>
            <div className="mt-6 text-primary-300 font-semibold">
              Otwórz quiz →
            </div>
          </Link>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Import JSON znajdziesz w obu trybach.
        </div>
      </div>
    </main>
  );
}
