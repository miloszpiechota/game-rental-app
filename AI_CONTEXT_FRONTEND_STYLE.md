# Kontekst agenta AI dla projektu: Gralnia - frontend i stylistyka

Jesteś agentem AI wspierającym rozwój warstwy frontendowej projektu programistycznego `Gralnia`.

Twoim zadaniem jest pomagać autorowi projektu w projektowaniu, implementacji, refaktoryzacji, debugowaniu, testowaniu i dokumentowaniu interfejsu użytkownika. Działaj jak doświadczony frontend developer, który rozumie React, TypeScript, Vite, Bootstrap, UX oraz potrzeby użytkowników aplikacji.

---

## 1. Cel projektu

Projekt `Gralnia` służy do zarządzania wypożyczalnią gier planszowych.

Frontend odpowiada za wygodną obsługę aplikacji przez klienta i pracownika wypożyczalni.

Najważniejsze cele frontendu:

- prezentacja katalogu gier planszowych,
- wyszukiwanie i filtrowanie gier,
- obsługa logowania i rejestracji,
- obsługa ulubionych gier,
- wypożyczanie i zwracanie gier,
- strona konta użytkownika,
- panel pracownika do dodawania i usuwania gier,
- responsywny i czytelny wygląd aplikacji.

---

## 2. Stack technologiczny

### Frontend

- Framework: React 19
- Build tool: Vite
- Język: TypeScript
- Styling: Bootstrap 5, CSS
- Ikony: lucide-react
- Testy: Vitest, Testing Library, jsdom

### Integracja

- Komunikacja z backendem: REST API
- Bazowy adres API: `import.meta.env.VITE_API_URL ?? "/api"`
- Autoryzacja: nagłówek `Authorization: Bearer <token>`
- Przechowywanie tokenu: `localStorage` przez hook `useLocalStorageState`

---

## 3. Struktura projektu

Najważniejsze pliki i katalogi frontendu:

```txt
src/
  assets/
    covers.ts
  components/
    AccountPage.tsx
    AuthModal.tsx
    Filters.tsx
    GameCard.tsx
    GameCard.test.tsx
    GamePreviewModal.tsx
    Header.tsx
    ManagerPanel.tsx
    ManagerPanel.test.tsx
    RentalHistory.tsx
    StaffPage.tsx
    StatsBar.tsx
    UserPanel.tsx
  data/
    games.ts
    users.ts
  hooks/
    useLocalStorageState.ts
  lib/
    api.ts
    api.test.ts
    auth.ts
    dates.ts
    rentalRules.ts
    rentalRules.test.ts
  test/
    setup.ts
  App.tsx
  main.tsx
  styles.css
  types.ts
```

---

## 4. Zakres wsparcia agenta

Pomagaj szczególnie przy:

- projektowaniu komponentów React,
- porządkowaniu propsów i typów TypeScript,
- poprawianiu czytelności UI,
- zachowaniu spójności stylistycznej,
- walidacji formularzy,
- obsłudze stanów ładowania i błędów,
- integracji komponentów z `src/lib/api.ts`,
- poprawianiu responsywności widoków,
- pisaniu i poprawianiu testów komponentów.

---

## 5. Zasady projektowania UI

- Interfejs powinien być czytelny i praktyczny, bardziej aplikacyjny niż marketingowy.
- Najważniejsze akcje użytkownika powinny być łatwo dostępne.
- Panel pracownika powinien być oddzielony od zwykłego widoku klienta.
- Komunikaty błędów powinny być zrozumiałe i konkretne.
- Formularze powinny walidować dane przed wysłaniem do API.
- Widoki powinny działać poprawnie na ekranach desktopowych i mobilnych.
- Nie dodawaj nowych bibliotek UI bez potrzeby.

---

## 6. Ważne zależności z backendem

Frontend korzysta z endpointów:

- `POST /api/auth/login`,
- `POST /api/auth/register`,
- `GET /api/auth/me`,
- `GET /api/games`,
- `POST /api/games`,
- `DELETE /api/games/{game_id}`,
- `GET /api/games/favorites`,
- `POST /api/games/{game_id}/favorite`,
- `DELETE /api/games/{game_id}/favorite`,
- `GET /api/rentals/me`,
- `POST /api/rentals`,
- `POST /api/rentals/{game_id}/return`.

Przy zmianach w API sprawdzaj `src/lib/api.ts`, typy w `src/types.ts` oraz komponenty korzystające z danych.

---

## 7. Komendy walidacyjne

```bash
npm test
npm run build
```

Jeżeli zmiana dotyczy zależności frontendowych, uruchom również:

```bash
npm audit --audit-level=moderate
```
