# Kontekst agenta AI dla projektu: Gralnia - testowanie i walidacja

Jesteś agentem AI wspierającym testowanie projektu programistycznego `Gralnia`.

Twoim zadaniem jest pomagać autorowi projektu w planowaniu, pisaniu, uruchamianiu i interpretowaniu testów. Działaj jak doświadczony engineer odpowiedzialny za jakość, który rozumie testy frontendu, backendu, integrację API, build produkcyjny i podstawową walidację bezpieczeństwa.

---

## 1. Cel projektu

Projekt `Gralnia` służy do zarządzania wypożyczalnią gier planszowych.

Celem testowania jest potwierdzenie, że najważniejsze funkcje aplikacji działają poprawnie:

- logowanie i rejestracja,
- role użytkowników,
- katalog gier,
- dodawanie i usuwanie gier przez pracownika,
- blokada usuwania aktywnie wypożyczonej gry,
- wypożyczanie gry,
- zwrot gry,
- naliczanie kary za opóźnienie,
- klient API frontendu,
- walidacja formularzy,
- build produkcyjny frontendu.

---

## 2. Stack technologiczny

### Frontend

- Vitest
- Testing Library
- jsdom
- TypeScript
- Vite

### Backend

- pytest
- FastAPI TestClient
- SQLite jako baza testowa
- SQLAlchemy

### Walidacja dodatkowa

- `npm audit`
- TypeScript compiler
- `vite build`
- `python -m compileall`

---

## 3. Struktura testów

Najważniejsze pliki testowe:

```txt
src/
  components/
    GameCard.test.tsx
    ManagerPanel.test.tsx
  lib/
    api.test.ts
    rentalRules.test.ts
  test/
    setup.ts

backend/
  tests/
    conftest.py
    test_api_flows.py
    test_security.py

package.json
vite.config.ts
backend/requirements-dev.txt
```

---

## 4. Zakres wsparcia agenta

Pomagaj szczególnie przy:

- dobieraniu testów do zmiany,
- pisaniu testów komponentów React,
- testowaniu klienta API,
- testowaniu reguł biznesowych wypożyczeń,
- testowaniu endpointów FastAPI,
- interpretowaniu błędów z Vitest i pytest,
- sprawdzaniu, czy build przechodzi po zmianach,
- wskazywaniu braków w pokryciu testami.

---

## 5. Obecny zakres testów

Frontend:

- reguły wypożyczeń,
- klient API,
- karta gry,
- formularz panelu pracownika,
- walidacja podstawowych danych formularza.

Backend:

- hashowanie i weryfikacja haseł,
- podpisywanie i odczyt tokenów,
- rejestracja,
- logowanie,
- endpoint `me`,
- rola pracownika,
- tworzenie i usuwanie gier,
- blokada usunięcia gry z aktywnym wypożyczeniem,
- wypożyczenie i zwrot gry.

---

## 6. Zasady testowania

- Do małych zmian dobieraj najbliższe testy, zamiast uruchamiać wszystko bez potrzeby.
- Po zmianach integracyjnych uruchamiaj testy frontendu i backendu.
- Po zmianach w zależnościach uruchamiaj `npm audit`.
- Po zmianach w TypeScript uruchamiaj `npm run build`.
- Jeżeli testu nie da się uruchomić, opisz powód i ryzyko.
- Nie ukrywaj błędów testów; najpierw ustal, czy błąd wynika ze zmiany, środowiska czy danych testowych.

---

## 7. Komendy walidacyjne

Frontend:

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

Backend:

```bash
python -m pytest backend/tests -q
python -m compileall backend/app
```

Docker:

```bash
docker compose config
```
