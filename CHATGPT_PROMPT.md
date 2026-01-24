# Prompt do generowania fiszek

## Instrukcja dla ChatGPT

Użyj tego promptu, aby wygenerować fiszki w formacie JSON z dowolnych materiałów edukacyjnych:

---

**Prompt:**

```
Wygeneruj fiszki w formacie JSON na podstawie poniższego materiału. Fiszki powinny:
- Zawierać pytania i odpowiedzi, które sprawdzą zrozumienie kluczowych pojęć
- Być zróżnicowane pod względem trudności (easy, medium, hard)
- Być przypisane do odpowiednich kategorii tematycznych
- Mieć unikalne ID (użyj liczb lub UUID)

Format wyjściowy:
{
  "title": "Tytuł zestawu fiszek",
  "description": "Krótki opis zestawu",
  "flashcards": [
    {
      "id": "1",
      "question": "Pytanie testujące wiedzę",
      "answer": "Precyzyjna odpowiedź",
      "category": "Kategoria tematyczna",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Materiał do przerobienia na fiszki:
[WKLEJ TUTAJ SWÓJ MATERIAŁ]
```

---

## Przykład użycia

**Materiał wejściowy:**

```
JavaScript to język programowania używany głównie do tworzenia interaktywnych stron internetowych.
TypeScript jest nadzbiorem JavaScript, który dodaje statyczne typowanie.
React to popularna biblioteka do budowania interfejsów użytkownika.
```

**Wygenerowane fiszki:**

```json
{
  "title": "Podstawy JavaScript i ekosystemu",
  "description": "Fiszki dotyczące JavaScript, TypeScript i React",
  "flashcards": [
    {
      "id": "1",
      "question": "Do czego służy JavaScript?",
      "answer": "JavaScript służy głównie do tworzenia interaktywnych stron internetowych",
      "category": "JavaScript",
      "difficulty": "easy"
    },
    {
      "id": "2",
      "question": "Czym różni się TypeScript od JavaScript?",
      "answer": "TypeScript jest nadzbiorem JavaScript, który dodaje statyczne typowanie",
      "category": "TypeScript",
      "difficulty": "medium"
    },
    {
      "id": "3",
      "question": "Do czego służy biblioteka React?",
      "answer": "React służy do budowania interfejsów użytkownika",
      "category": "React",
      "difficulty": "easy"
    }
  ]
}
```

## Wskazówki

1. **Dobieraj odpowiednie pytania**: Pytania powinny testować zrozumienie, a nie tylko zapamiętywanie
2. **Używaj jasnych odpowiedzi**: Odpowiedzi powinny być zwięzłe ale kompletne
3. **Kategoryzuj logicznie**: Grupuj fiszki według tematów
4. **Zróżnicuj poziomy**: Uwzględnij pytania łatwe, średnie i trudne
5. **Generuj odpowiednią ilość**: 10-30 fiszek na temat to dobry zakres

## Format dla różnych typów materiałów

### Dla notatek z wykładu:

- Wyciągnij kluczowe definicje
- Stwórz pytania o przyczyny i skutki
- Dodaj pytania kontekstowe

### Dla artykułów technicznych:

- Pytania o pojęcia i terminologię
- Pytania o praktyczne zastosowania
- Pytania o różnice między rozwiązaniami

### Dla książek:

- Pytania o główne tezy
- Pytania o przykłady i case studies
- Pytania syntetyzujące wiedzę z różnych rozdziałów

---

# Prompt do generowania quizów

## Instrukcja dla ChatGPT

Użyj tego promptu, aby wygenerować quiz w formacie JSON z dowolnych materiałów edukacyjnych:

---

**Prompt:**

```
Wygeneruj quiz w formacie JSON na podstawie poniższego materiału. Quiz powinien:
- Zawierać pytania wielokrotnego wyboru z 4 opcjami odpowiedzi każda
- Mieć dokładnie jedną poprawną odpowiedź na pytanie
- Być zróżnicowane pod względem trudności (easy, medium, hard)
- Być przypisane do odpowiednich kategorii tematycznych
- Mieć unikalne ID dla pytań (użyj liczb lub UUID)
- Zawierać wyjaśnienie dla każdej poprawnej odpowiedzi (opcjonalne, ale zalecane)

Format wyjściowy:
{
  "title": "Tytuł zestawu quizu",
  "description": "Krótki opis zestawu",
  "questions": [
    {
      "id": "1",
      "question": "Pytanie testujące wiedzę",
      "options": ["Opcja A", "Opcja B", "Opcja C", "Opcja D"],
      "correctIndex": 0,
      "explanation": "Wyjaśnienie dlaczego ta odpowiedź jest poprawna",
      "category": "Kategoria tematyczna",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Materiał do przerobienia na quiz:
[WKLEJ TUTAJ SWÓJ MATERIAŁ]
```

---

## Przykład użycia

**Materiał wejściowy:**

```
JavaScript to język programowania używany głównie do tworzenia interaktywnych stron internetowych.
TypeScript jest nadzbiorem JavaScript, który dodaje statyczne typowanie.
React to popularna biblioteka do budowania interfejsów użytkownika.
```

**Wygenerowany quiz:**

```json
{
  "title": "Quiz: Podstawy JavaScript i ekosystemu",
  "description": "Quiz dotyczący JavaScript, TypeScript i React",
  "questions": [
    {
      "id": "1",
      "question": "Do czego głównie służy JavaScript?",
      "options": [
        "Do tworzenia interaktywnych stron internetowych",
        "Do projektowania baz danych",
        "Do zarządzania serwerami",
        "Do analizy danych statystycznych"
      ],
      "correctIndex": 0,
      "explanation": "JavaScript jest językiem programowania używanym głównie do tworzenia interaktywnych stron internetowych",
      "category": "JavaScript",
      "difficulty": "easy"
    },
    {
      "id": "2",
      "question": "Czym różni się TypeScript od JavaScript?",
      "options": [
        "TypeScript dodaje statyczne typowanie do JavaScript",
        "TypeScript usuwa funkcje z JavaScript",
        "TypeScript jest starszą wersją JavaScript",
        "TypeScript działa tylko na serwerze"
      ],
      "correctIndex": 0,
      "explanation": "TypeScript jest nadzbiorem JavaScript, który dodaje statyczne typowanie, co pomaga w wykrywaniu błędów na etapie kompilacji",
      "category": "TypeScript",
      "difficulty": "medium"
    },
    {
      "id": "3",
      "question": "Do czego służy biblioteka React?",
      "options": [
        "Do budowania interfejsów użytkownika",
        "Do zarządzania bazami danych",
        "Do tworzenia animacji 3D",
        "Do optymalizacji wyszukiwarek"
      ],
      "correctIndex": 0,
      "explanation": "React to popularna biblioteka JavaScript do budowania interfejsów użytkownika, szczególnie aplikacji internetowych",
      "category": "React",
      "difficulty": "easy"
    }
  ]
}
```

## Wskazówki dla quizów

1. **Twórz pytania wielokrotnego wyboru**: Każde pytanie powinno mieć dokładnie 4 opcje odpowiedzi
2. **Upewnij się o jednej poprawnej odpowiedzi**: correctIndex wskazuje indeks poprawnej opcji (0-3)
3. **Dodawaj wyjaśnienia**: Wyjaśnienia pomagają w nauce i zrozumieniu błędów
4. **Zróżnicuj poziomy trudności**: Łatwe pytania na podstawy, średnie na zrozumienie, trudne na analizę
5. **Kategoryzuj pytania**: Grupuj według tematów dla lepszej organizacji
6. **Generuj odpowiednią ilość**: 10-20 pytań na temat to dobry zakres

## Format dla różnych typów materiałów

### Dla notatek z wykładu:

- Pytania o kluczowe definicje i pojęcia
- Pytania o przyczyny i skutki
- Pytania wymagające analizy kontekstu

### Dla artykułów technicznych:

- Pytania o terminologię i pojęcia techniczne
- Pytania o praktyczne zastosowania technologii
- Pytania porównujące różne rozwiązania

### Dla książek:

- Pytania o główne tezy i argumenty autora
- Pytania o przykłady i case studies
- Pytania syntetyzujące wiedzę z różnych rozdziałów
