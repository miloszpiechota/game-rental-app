# AI Context

Projekt został przygotowany we współpracy z modelem LLM w roli asystenta programistycznego.

## Prompt bazowy

Użytkownik poprosił o aplikację do zarządzania wypożyczalnią gier planszowych, początkowo jako frontend React + Vite + Bootstrap, a następnie o rozbudowę do full stack z backendem FastAPI, bazą MariaDB oraz manifestami Kubernetes/Minikube.

## Zakres wygenerowany z pomocą AI

- struktura aplikacji React,
- komponenty katalogu gier, konta użytkownika i panelu pracownika,
- reguły wypożyczeń oraz naliczania kary,
- backend FastAPI z endpointami `/api/auth`, `/api/games`, `/api/rentals`,
- modele SQLAlchemy i schematy Pydantic,
- konfiguracja Docker, Docker Compose i Nginx,
- manifesty Kubernetes dla Minikube,
- README oraz instrukcje uruchomienia.

## Modyfikacje po wygenerowaniu

Kod był iteracyjnie poprawiany zgodnie z wymaganiami projektu:

- panel użytkownika został przeniesiony do osobnej strony konta,
- panel pracownika został ograniczony do roli `pracownik`,
- dodano blokadę usuwania gier z aktywnym wypożyczeniem,
- dodano walidację danych formularzy,
- dodano responsywność widoków,
- dodano integrację frontendu z API.

## Uwagi

LLM nie zastępuje obrony projektu. Na obronie należy umieć wyjaśnić działanie endpointów, manifestów Kubernetes, kontenerów, połączenia z MariaDB oraz przepływu danych między React i FastAPI.
