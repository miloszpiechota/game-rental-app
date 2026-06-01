# Kontekst projektu: wypożyczalnia gier planszowych

## Cel

Aplikacja ma obsługiwać katalog gier planszowych, wyszukiwanie, filtrowanie, ulubione, logowanie/rejestrację oraz wypożyczanie gier z terminem zwrotu. Obecna wersja jest frontendowym prototypem bez backendu, ale struktura danych i logika są przygotowane pod późniejsze API.

## Stack

- Frontend: React, Vite, TypeScript, Bootstrap, lucide-react.
- Backend: FastAPI, Python, SQLAlchemy.
- Baza danych: MariaDB.
- Uruchomienie: Docker Compose albo Minikube/Kubernetes.
- Testy teraz: Vitest dla reguł wypożyczeń.

## Funkcje obecnej wersji

- Przeglądanie katalogu gier.
- Wyszukiwanie po tytule, kategorii, opisie i tagach.
- Filtrowanie po kategorii, dostępności, liczbie graczy i trudności.
- Dodawanie gier do ulubionych.
- Rejestracja i logowanie lokalne.
- Wypożyczanie z wyborem terminu: 7, 14, 21 albo 30 dni.
- Statusy gry: dostępna, zajęta, wypożyczona przez aktualnego użytkownika.
- Oddawanie gry.
- Panel użytkownika z aktywnymi wypożyczeniami.
- Informacja o opóźnieniu i szacowanej karze.
- Historia wypożyczeń użytkownika.
- Panel pracownika do dodawania gier do katalogu.

## Dane i modele

`BoardGame`
- `id`
- `title`
- `category`
- `complexity`
- `playersMin`
- `playersMax`
- `durationMinutes`
- `rating`
- `cover`
- `description`
- `tags`
- `borrowedBy`
- `borrowedAt`
- `dueDate`

`AppUser`
- `id`
- `name`
- `email`
- `passwordDigest`
- `joinedAt`

`RentalRecord`
- `id`
- `gameId`
- `gameTitle`
- `userId`
- `userName`
- `borrowedAt`
- `dueDate`
- `returnedAt`
- `penaltyAtReturn`

W obecnej wersji stan jest w `localStorage` pod kluczami:

- `gralnia.games`
- `gralnia.users`
- `gralnia.currentUser`
- `gralnia.favorites`
- `gralnia.rentalHistory`

## Ważne reguły biznesowe

- Maksymalny termin wypożyczenia to 30 dni.
- Domyślne dostępne terminy: 7, 14, 21, 30 dni.
- Gra może być wypożyczona tylko przez jednego użytkownika naraz.
- Jeżeli gra jest wypożyczona przez innego użytkownika, akcja pokazuje `Gra jest zajęta`.
- Jeżeli gra jest wypożyczona przez aktualnego użytkownika, akcja pokazuje `Oddaj grę`.
- Kara demonstracyjna wynosi 2,50 PLN za każdy dzień opóźnienia.

## Endpointy FastAPI

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /games`
- `POST /games`
- `DELETE /games/{game_id}`
- `POST /games/{game_id}/favorite`
- `DELETE /games/{game_id}/favorite`
- `GET /games/favorites`
- `GET /rentals/me`
- `POST /rentals`
- `POST /rentals/{game_id}/return`

## Proponowane tabele MariaDB

- `users`
- `games`
- `game_tags`
- `favorites`
- `rentals`
- `penalty_rules`

## Uwagi do migracji na backend

- Lokalny `passwordDigest` jest wyłącznie atrapą do prototypu. W backendzie użyć hashowania haseł, np. Argon2 albo bcrypt.
- Operacje z `handleBorrow`, `handleReturn`, `handleLogin`, `handleRegister` przenieść do serwisów API.
- Reguły z `src/lib/rentalRules.ts` można zachować jako wspólną logikę frontendową do walidacji UI, ale backend musi być źródłem prawdy.
- Przy MariaDB dodać transakcję przy wypożyczeniu gry, żeby uniknąć podwójnego wypożyczenia tej samej pozycji.
