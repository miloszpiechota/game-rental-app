# Gralnia - wypożyczalnia gier planszowych

Aplikacja full stack do zarządzania wypożyczalnią gier planszowych. Frontend jest napisany w React + Vite + TypeScript + Bootstrap, backend w FastAPI, a docelowa baza danych to MariaDB. Projekt zawiera też manifesty Kubernetes przygotowane do uruchomienia w Minikube.

## Funkcje

- katalog gier planszowych,
- wyszukiwanie i filtrowanie gier,
- ulubione,
- rejestracja i logowanie,
- role użytkowników: `klient` i `pracownik`,
- wypożyczanie gry z terminem zwrotu do 30 dni,
- oddawanie gier i naliczanie kary za opóźnienie,
- strona konta użytkownika,
- panel pracownika do dodawania i usuwania gier,
- blokada usuwania gry, która jest aktualnie wypożyczona.

## Konto demo

```text
E-mail: demo@gralnia.pl
Hasło: demo123
Rola: pracownik
```

## Uruchomienie lokalne bez Kubernetes

Wariant kontenerowy:

```bash
docker compose up --build
```

Po starcie:

- frontend: `http://localhost:8080`
- backend: `http://localhost:8000/api/health`
- MariaDB: dostępna wewnątrz sieci Compose jako `mariadb:3306`

Wariant developerski:

```bash
docker compose up -d mariadb
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL="mysql+pymysql://gralnia:gralnia_password@127.0.0.1:3307/gralnia"
$env:API_SECRET_KEY="local-dev-secret"
uvicorn app.main:app --reload
```

W drugim terminalu:

```bash
npm install
npm run dev
```

Frontend działa pod `http://127.0.0.1:5173` i proxy Vite kieruje `/api` do `http://127.0.0.1:8000`.

Jeżeli chcesz łączyć się z MariaDB z backendu uruchomionego bez Dockera, dodaj tymczasowo do usługi `mariadb` w `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"
```

## Uruchomienie w Minikube

1. Uruchom Minikube:

```bash
minikube start
```

2. Skieruj lokalny Docker na środowisko Minikube.

PowerShell:

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

3. Zbuduj obrazy wewnątrz Minikube:

```bash
docker build -t game-rental-backend:latest -f backend/Dockerfile backend
docker build -t game-rental-frontend:latest -f Dockerfile.frontend .
```

4. Zastosuj manifesty:

```bash
kubectl apply -f k8s/
```

5. Sprawdź status:

```bash
kubectl get pods -n gralnia
kubectl get svc -n gralnia
```

6. Otwórz aplikację:

```bash
minikube service frontend -n gralnia
```

Alternatywnie, jeżeli NodePort jest dostępny:

```text
http://<minikube-ip>:30080
```

Adres IP można sprawdzić:

```bash
minikube ip
```

## Szybki redeploy po zmianach

Po zmianach w kodzie frontendu, backendu albo manifestach Kubernetes najprosciej przebudowac i odswiezyc aplikacje jednym poleceniem:

```powershell
npm run k8s:redeploy
```

To polecenie uruchamia skrypt [scripts/redeploy-minikube.ps1](scripts/redeploy-minikube.ps1), ktory:

- uruchamia Minikube,
- buduje obrazy `game-rental-backend:latest` i `game-rental-frontend:latest` bezposrednio w Minikube,
- wykonuje `kubectl apply -f k8s/`,
- restartuje Deploymenty `backend` i `frontend`,
- czeka na zakonczenie rolloutow,
- pokazuje aktualne pody i serwisy.

Jezeli po redeployu chcesz od razu uruchomic frontend przez port-forward:

```powershell
npm run k8s:redeploy:open
```

Frontend bedzie dostepny pod:

```text
http://127.0.0.1:8080
```

Terminal z `k8s:redeploy:open` musi pozostac otwarty, bo `kubectl port-forward` dziala tylko tak dlugo, jak dziala to polecenie.

Skrypt mozna tez uruchomic bezposrednio:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/redeploy-minikube.ps1
```

Dodatkowe opcje:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/redeploy-minikube.ps1 -SkipMinikubeStart
powershell -ExecutionPolicy Bypass -File scripts/redeploy-minikube.ps1 -SkipBuild
powershell -ExecutionPolicy Bypass -File scripts/redeploy-minikube.ps1 -PortForward -FrontendPort 8081
```

## Poprawne uruchomienie aplikacji w Kubernetes

Ponizsze komendy uruchamiaja cala aplikacje `game-rental-app` w Minikube: MariaDB, backend FastAPI i frontend React/Nginx.

1. Wejdz do katalogu projektu:

```powershell
cd path\to\game-rental-app
```

2. Uruchom Minikube:

```powershell
minikube start
```

3. Skieruj lokalny Docker na srodowisko Minikube:

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

4. Zbuduj obrazy aplikacji:

```powershell
docker build -t game-rental-backend:latest -f backend/Dockerfile backend
docker build -t game-rental-frontend:latest -f Dockerfile.frontend .
```

5. Wdroz manifesty Kubernetes:

```powershell
kubectl apply -f k8s/
```

6. Sprawdz, czy pody dzialaja:

```powershell
kubectl get pods -n gralnia
```

Oczekiwany wynik:

```text
backend    1/1 Running
frontend   1/1 Running
mariadb    1/1 Running
```

7. Sprawdz serwisy:

```powershell
kubectl get svc -n gralnia
```

Frontend powinien miec Service typu `NodePort` z portem `30080`, a backend i MariaDB powinny miec `ClusterIP`.

8. Sprawdz backend:

W pierwszym terminalu uruchom:

```powershell
kubectl port-forward -n gralnia svc/backend 8000:8000
```

W drugim terminalu wykonaj:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

9. Uruchom frontend przez port-forward:

```powershell
kubectl port-forward -n gralnia svc/frontend 8080:80
```

Zostaw terminal z `port-forward` otwarty i wejdz w przegladarce na:

```text
http://127.0.0.1:8080
```

Jezeli port `8080` jest zajety, uzyj innego portu lokalnego:

```powershell
kubectl port-forward -n gralnia svc/frontend 8081:80
```

Wtedy otworz:

```text
http://127.0.0.1:8081
```

10. Alternatywnie otworz frontend przez NodePort:

```powershell
minikube service frontend -n gralnia
```

Albo pobierz sam adres:

```powershell
minikube service frontend -n gralnia --url
```

W tym projekcie frontend jest wystawiony jako:

```text
http://<minikube-ip>:30080
```

Adres IP Minikube sprawdzisz komenda:

```powershell
minikube ip
```

Najczestszy problem: po zamknieciu terminala z `kubectl port-forward` adres `http://127.0.0.1:8080` przestaje dzialac. Terminal z port-forward musi byc caly czas otwarty.

## Struktura projektu

```text
backend/
  app/
    core/          konfiguracja FastAPI
    routers/       endpointy auth, games, rentals
    main.py        start aplikacji FastAPI
    models.py      modele SQLAlchemy
    schemas.py     schematy Pydantic
    seed.py        dane demo
  Dockerfile
  requirements.txt
k8s/
  manifesty Minikube: namespace, config, secret, MariaDB, backend, frontend
src/
  frontend React
docker-compose.yml
Dockerfile.frontend
nginx.conf
KONTEKST_PROJEKTU.md
AI_CONTEXT.md
```

## Manifesty Kubernetes

- `k8s/00-namespace.yaml` - namespace `gralnia`,
- `k8s/01-configmap.yaml` - konfiguracja aplikacji,
- `k8s/02-rbac.yaml` - ServiceAccount, Role i RoleBinding dla backendu,
- `k8s/02-secret.yaml` - hasła i connection string,
- `k8s/03-mariadb.yaml` - MariaDB, PVC i Service,
- `k8s/04-backend.yaml` - FastAPI Deployment i Service,
- `k8s/05-frontend.yaml` - Nginx + React Deployment i NodePort Service.

## CI/CD

Projekt zawiera workflowy GitHub Actions w katalogu `.github/workflows/`.

- `ci.yml` uruchamia się dla pull requestów oraz pushy do `main` i gałęzi `codex/**`. Sprawdza testy frontendowe, build React/Vite, testy backendu, kompilację kodu Python oraz poprawność budowania obrazów Docker.
- `cd.yml` uruchamia się po pushu do `main` albo ręcznie przez `workflow_dispatch`. Najpierw wykonuje testy i build, a dopiero potem buduje obrazy backendu i frontendu oraz publikuje je do GitHub Container Registry:
  - `ghcr.io/<owner>/<repo>/backend:latest`,
  - `ghcr.io/<owner>/<repo>/frontend:latest`.

W lokalnym Minikube można dalej korzystać z obrazów budowanych lokalnie zgodnie z instrukcją powyżej. Obrazy z GHCR są przygotowane pod późniejsze wdrożenie z rejestru.

## AI / LLM

W projekcie korzystano z pomocy modelu LLM jako narzędzia pomocniczego przy konsultowaniu rozwiązań, porządkowaniu kodu i iteracyjnej modyfikacji:

- komponentów React,
- backendu FastAPI,
- manifestów KuberneWprowadzone treści były następnie modyfikowane pod wymagania projektu: role użytkowników, blokada usuwania wypożyczonych gier, walidacja formularzy, integracja API oraz instrukcja Minikube.tes,
- konfiguracji Docker/Nginx,
- dokumentacji README,
- pliku kontekstu projektu.

Opis kontekstu i zakres użycia AI znajduje się w [AI_CONTEXT.md](AI_CONTEXT.md). Plik główny odsyła też do osobnych kontekstów agentów:

- [AI_CONTEXT_FRONTEND_STYLE.md](AI_CONTEXT_FRONTEND_STYLE.md) - frontend, stylistyka i UX,
- [AI_CONTEXT_BACKEND_FASTAPI.md](AI_CONTEXT_BACKEND_FASTAPI.md) - backend FastAPI i integracja API,
- [AI_CONTEXT_FULLSTACK_MINIKUBE.md](AI_CONTEXT_FULLSTACK_MINIKUBE.md) - Docker, Nginx, Kubernetes i Minikube,
- [AI_CONTEXT_SECURITY_AUDIT.md](AI_CONTEXT_SECURITY_AUDIT.md) - audyt bezpieczeństwa,
- [AI_CONTEXT_TESTING.md](AI_CONTEXT_TESTING.md) - testowanie i walidacja.



## Testy i build

Frontend:

```bash
npm test
npm run build
```

Backend:

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest backend/tests -q
python -m compileall backend/app
```

Zakres testów:

- backend: hashowanie haseł, tokeny, rejestracja, logowanie, `me`, rola pracownika, tworzenie/usuwanie gier, blokada usunięcia wypożyczonej gry, wypożyczenie, zwrot i kara za opóźnienie,
- frontend: reguły wypożyczeń, klient API, karta gry, podgląd gry przez kliknięcie, formularz panelu pracownika i walidacja.


