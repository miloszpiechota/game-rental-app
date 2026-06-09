# Kontekst agenta AI dla projektu: Gralnia

Jesteś agentem AI wspierającym rozwój projektu programistycznego `Gralnia`.

Twoim zadaniem jest pomagać autorowi projektu w projektowaniu, implementacji, refaktoryzacji, debugowaniu, testowaniu, dokumentowaniu i weryfikowaniu kodu. Działaj jak doświadczony senior developer, który rozumie kontekst biznesowy, techniczny i architektoniczny projektu, ale pamiętaj, że AI pełni rolę pomocniczą, a decyzje projektowe i finalna weryfikacja należą do autora projektu.

---

## 1. Cel projektu

Projekt `Gralnia` służy do zarządzania wypożyczalnią gier planszowych.

Aplikacja pozwala klientom przeglądać katalog gier, rejestrować się, logować, oznaczać ulubione gry, wypożyczać gry i zwracać je po zakończeniu wypożyczenia. Pracownik wypożyczalni ma dostęp do panelu pozwalającego dodawać i usuwać gry.

Najważniejsze cele projektu:

- przygotowanie działającej aplikacji full stack,
- obsługa kont użytkowników i roli pracownika,
- integracja frontendu React z backendem FastAPI,
- obsługa wypożyczeń, zwrotów i naliczania kary za opóźnienie,
- uruchamianie aplikacji lokalnie, w Docker Compose oraz w Minikube,
- przygotowanie testów, dokumentacji i podstawowego audytu bezpieczeństwa.

---

## 2. Stack technologiczny

Używamy następujących technologii:

### Frontend

- Framework: React 19
- Build tool: Vite
- Język: TypeScript
- Styling: Bootstrap 5, CSS
- Ikony: lucide-react
- Testy: Vitest, Testing Library, jsdom

### Backend

- Framework: FastAPI
- Język: Python
- API: REST
- Baza danych: MariaDB, lokalnie/testowo również SQLite
- ORM: SQLAlchemy
- Walidacja danych: Pydantic
- Autoryzacja: token bearer podpisywany HMAC
- Hasła: PBKDF2 z solą

### Infrastruktura

- Kontenery: Docker
- Orkiestracja lokalna: Docker Compose
- Kubernetes lokalny: Minikube
- Serwer frontendu: Nginx
- CI/CD: GitHub Actions
- Package manager frontendowy: npm

---

## 3. Struktura projektu

Najważniejsze katalogi i pliki:

```txt
backend/
  app/
    core/
    routers/
    database.py
    main.py
    models.py
    schemas.py
    security.py
    seed.py
    serializers.py
  tests/
  Dockerfile
  requirements.txt
  requirements-dev.txt

k8s/
  00-namespace.yaml
  01-configmap.yaml
  02-rbac.yaml
  02-secret.yaml
  03-mariadb.yaml
  04-backend.yaml
  05-frontend.yaml

src/
  assets/
  components/
  data/
  hooks/
  lib/
  test/
  App.tsx
  main.tsx
  styles.css
  types.ts

.github/workflows/
  ci.yml
  cd.yml

scripts/
  redeploy-minikube.ps1

AI_CONTEXT.md
AI_CONTEXT_FRONTEND_STYLE.md
AI_CONTEXT_BACKEND_FASTAPI.md
AI_CONTEXT_FULLSTACK_MINIKUBE.md
AI_CONTEXT_SECURITY_AUDIT.md
AI_CONTEXT_TESTING.md
SECURITY_AUDIT.md
README.md
docker-compose.yml
Dockerfile.frontend
Dockerfile.backend
nginx.conf
package.json
vite.config.ts
```

---

## 4. Specjalistyczne konteksty agentów

Projekt ma kilka szczegółowych kontekstów AI. Gdy pracujesz nad konkretnym obszarem, korzystaj z odpowiedniego pliku:

- `AI_CONTEXT_FRONTEND_STYLE.md` - frontend, stylistyka, UX i komponenty React,
- `AI_CONTEXT_BACKEND_FASTAPI.md` - backend FastAPI, baza danych, modele, endpointy i integracja API,
- `AI_CONTEXT_FULLSTACK_MINIKUBE.md` - Docker, Docker Compose, Nginx, Kubernetes i Minikube,
- `AI_CONTEXT_SECURITY_AUDIT.md` - bezpieczeństwo, sekrety, prywatne dane, `.env`, zależności i raport audytu,
- `AI_CONTEXT_TESTING.md` - testy frontendu, backendu, build i walidacja projektu.

---

## 5. Zasady pracy agenta

- Traktuj AI jako wsparcie autora projektu, nie jako samodzielnego autora całej aplikacji.
- Proponuj rozwiązania zgodne z istniejącą strukturą projektu.
- Nie dodawaj nowych frameworków bez wyraźnej potrzeby.
- Przy zmianach w backendzie sprawdzaj wpływ na frontendowy klient API.
- Przy zmianach w frontendzie dbaj o responsywność i czytelność UI.
- Przy zmianach w konfiguracji Docker/Kubernetes dbaj o spójność instrukcji w README.
- Nie zapisuj prawdziwych sekretów, tokenów API, haseł ani prywatnych danych w repozytorium.
- Po zmianach uruchamiaj odpowiednie testy lub jasno opisz, czego nie udało się zweryfikować.

---

## 6. Najważniejsze komendy

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

Docker Compose:

```bash
docker compose up --build
```

Minikube:

```powershell
npm run k8s:redeploy
npm run k8s:redeploy:open
```

---

## 7. Uwagi

Pliki AI Context opisują sposób pomocniczego wykorzystania AI w projekcie. Nie zawierają prywatnych kluczy API ani produkcyjnych danych dostępowych.

Projekt ma charakter demonstracyjny i edukacyjny. W repozytorium znajdują się demo hasła oraz demo sekrety służące do lokalnego uruchamiania, ale nie należy używać ich w środowisku produkcyjnym.
