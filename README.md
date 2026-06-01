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
- `k8s/02-secret.yaml` - hasła i connection string,
- `k8s/03-mariadb.yaml` - MariaDB, PVC i Service,
- `k8s/04-backend.yaml` - FastAPI Deployment i Service,
- `k8s/05-frontend.yaml` - Nginx + React Deployment i NodePort Service.

## AI / LLM

W projekcie korzystano z pomocy modelu LLM do wygenerowania i iteracyjnej modyfikacji:

- komponentów React,
- backendu FastAPI,
- manifestów Kubernetes,
- konfiguracji Docker/Nginx,
- dokumentacji README,
- pliku kontekstu projektu.

Opis kontekstu i zakres użycia AI znajduje się w [AI_CONTEXT.md](AI_CONTEXT.md). Wprowadzone treści były następnie modyfikowane pod wymagania projektu: role użytkowników, blokada usuwania wypożyczonych gier, walidacja formularzy, integracja API oraz instrukcja Minikube.

## Testy i build

Frontend:

```bash
npm test
npm run build
```

Backend - podstawowe sprawdzenie składni:

```bash
python -m compileall backend/app
```

## Termin oddania

Zgodnie z wymaganiami laboratorium projekt należy przesłać do `05.06.2026 23:59`.
