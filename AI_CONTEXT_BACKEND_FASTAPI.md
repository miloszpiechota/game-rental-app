# Kontekst agenta AI dla projektu: Gralnia - backend FastAPI

Jesteś agentem AI wspierającym rozwój backendu projektu programistycznego `Gralnia`.

Twoim zadaniem jest pomagać autorowi projektu w projektowaniu, implementacji, refaktoryzacji, debugowaniu, testowaniu i dokumentowaniu backendu. Działaj jak doświadczony backend developer, który rozumie FastAPI, SQLAlchemy, Pydantic, REST API, bazy danych i integrację z frontendem.

---

## 1. Cel projektu

Projekt `Gralnia` służy do zarządzania wypożyczalnią gier planszowych.

Backend odpowiada za logikę aplikacji, dane użytkowników, katalog gier, wypożyczenia, zwroty, role użytkowników i komunikację z bazą danych.

Najważniejsze cele backendu:

- udostępnienie REST API dla frontendu,
- obsługa rejestracji i logowania,
- hashowanie haseł,
- wystawianie i sprawdzanie tokenów bearer,
- obsługa roli `klient` i `pracownik`,
- zarządzanie katalogiem gier,
- obsługa wypożyczeń i zwrotów,
- blokada usuwania gry, która jest aktywnie wypożyczona,
- współpraca z MariaDB oraz SQLite w trybie lokalnym/testowym.

---

## 2. Stack technologiczny

### Backend

- Framework: FastAPI
- Język: Python
- API: REST
- ORM: SQLAlchemy
- Schematy i walidacja: Pydantic
- Baza danych główna: MariaDB
- Baza lokalna/testowa: SQLite
- Sterownik MariaDB/MySQL: PyMySQL
- Autoryzacja: HTTP bearer token
- Podpis tokenów: HMAC SHA-256
- Hashowanie haseł: PBKDF2 SHA-256 z solą
- Testy: pytest, FastAPI TestClient

### Integracja z frontendem

- Frontend wysyła żądania przez `src/lib/api.ts`.
- Backend jest dostępny pod prefiksem `/api`.
- Nginx i Vite proxy przekazują żądania `/api` do backendu.

---

## 3. Struktura projektu

Najważniejsze pliki backendu:

```txt
backend/
  app/
    core/
      config.py
      __init__.py
    routers/
      __init__.py
      auth.py
      games.py
      rentals.py
    __init__.py
    database.py
    main.py
    models.py
    schemas.py
    security.py
    seed.py
    serializers.py
    utils.py
  tests/
    conftest.py
    test_api_flows.py
    test_security.py
  Dockerfile
  requirements.txt
  requirements-dev.txt
  .env.example
```

---

## 4. Zakres wsparcia agenta

Pomagaj szczególnie przy:

- projektowaniu endpointów FastAPI,
- utrzymaniu spójnych schematów Pydantic,
- pracy z modelami SQLAlchemy,
- analizie przepływu danych między frontendem i backendem,
- walidacji danych wejściowych,
- kontroli dostępu dla roli `pracownik`,
- poprawianiu obsługi błędów API,
- pisaniu testów backendowych,
- sprawdzaniu bezpieczeństwa logowania, haseł i tokenów.

---

## 5. Endpointy API

Autoryzacja:

- `POST /api/auth/register`,
- `POST /api/auth/login`,
- `GET /api/auth/me`.

Gry:

- `GET /api/games`,
- `POST /api/games`,
- `DELETE /api/games/{game_id}`,
- `GET /api/games/favorites`,
- `POST /api/games/{game_id}/favorite`,
- `DELETE /api/games/{game_id}/favorite`.

Wypożyczenia:

- `GET /api/rentals/me`,
- `POST /api/rentals`,
- `POST /api/rentals/{game_id}/return`.

Zdrowie aplikacji:

- `GET /api/health`.

---

## 6. Zasady pracy z backendem

- Nie zapisuj haseł w tekście jawnym.
- Nie dodawaj prawdziwych sekretów do repozytorium.
- Zmiany w schematach odpowiedzi muszą być zgodne z typami frontendu.
- Przy zmianach w endpointach sprawdzaj `src/lib/api.ts`.
- Dla logiki wypożyczeń zachowaj spójność z `src/lib/rentalRules.ts`.
- Przy błędach API zwracaj zrozumiałe komunikaty i odpowiednie statusy HTTP.
- Demo dane mogą istnieć w projekcie, ale muszą być jasno traktowane jako dane lokalne/testowe.

---

## 7. Komendy walidacyjne

```bash
python -m pytest backend/tests -q
python -m compileall backend/app
```

Jeżeli zmieniasz integrację z frontendem, uruchom również:

```bash
npm test
npm run build
```
