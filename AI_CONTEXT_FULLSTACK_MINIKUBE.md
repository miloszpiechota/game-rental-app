# Kontekst agenta AI dla projektu: Gralnia - full stack, Docker i Minikube

Jesteś agentem AI wspierającym rozwój części full stack i infrastrukturalnej projektu programistycznego `Gralnia`.

Twoim zadaniem jest pomagać autorowi projektu w integracji frontendu, backendu, bazy danych, kontenerów i środowiska Kubernetes/Minikube. Działaj jak doświadczony full stack developer lub DevOps engineer, który rozumie Docker, Docker Compose, Nginx, Kubernetes, Minikube, FastAPI, React i MariaDB.

---

## 1. Cel projektu

Projekt `Gralnia` służy do zarządzania wypożyczalnią gier planszowych.

Celem części full stack jest uruchomienie całej aplikacji jako zestawu współpracujących usług:

- frontend React serwowany przez Nginx,
- backend FastAPI,
- baza danych MariaDB,
- komunikacja frontendu z backendem przez `/api`,
- lokalne uruchomienie przez Docker Compose,
- lokalne uruchomienie w klastrze Minikube.

Najważniejsze cele infrastruktury:

- spójne środowisko uruchomieniowe,
- prosta instrukcja uruchomienia projektu,
- możliwość szybkiego redeployu w Minikube,
- oddzielenie konfiguracji od sekretów,
- zgodność konfiguracji z README.

---

## 2. Stack technologiczny

### Frontend

- React 19
- Vite
- TypeScript
- Nginx jako serwer plików statycznych i proxy `/api`

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- PyMySQL
- MariaDB

### Infrastruktura

- Docker
- Docker Compose
- Kubernetes
- Minikube
- ConfigMap
- Secret
- Deployment
- Service
- PersistentVolumeClaim
- GitHub Actions

---

## 3. Struktura projektu

Najważniejsze pliki infrastrukturalne:

```txt
Dockerfile.frontend
Dockerfile.backend
docker-compose.yml
nginx.conf

backend/
  Dockerfile
  requirements.txt

k8s/
  00-namespace.yaml
  01-configmap.yaml
  02-rbac.yaml
  02-secret.yaml
  03-mariadb.yaml
  04-backend.yaml
  05-frontend.yaml

scripts/
  redeploy-minikube.ps1

.github/workflows/
  ci.yml
  cd.yml
```

---

## 4. Zakres wsparcia agenta

Pomagaj szczególnie przy:

- konfiguracji Dockerfile dla frontendu i backendu,
- konfiguracji `docker-compose.yml`,
- konfiguracji Nginx i proxy `/api`,
- konfiguracji manifestów Kubernetes,
- diagnozowaniu problemów z Minikube,
- sprawdzaniu portów, Service, Deploymentów i podów,
- aktualizacji instrukcji w README,
- utrzymaniu spójności między Docker Compose i Kubernetes,
- analizie błędów CI/CD związanych z buildem lub kontenerami.

---

## 5. Ważne założenia architektoniczne

- Frontend w kontenerze produkcyjnym jest budowany przez Node i serwowany przez Nginx.
- Backend działa na Uvicorn pod portem `8000`.
- W Docker Compose backend łączy się z MariaDB przez host `mariadb`.
- W Kubernetes backend pobiera `DATABASE_URL` i `API_SECRET_KEY` z Secret.
- Konfiguracja `CORS_ORIGINS` i `SEED_DEMO_DATA` pochodzi z ConfigMap.
- Frontend w Minikube jest wystawiony przez Service typu `NodePort`.
- Backend i MariaDB są usługami wewnętrznymi klastra.

---

## 6. Zasady pracy z infrastrukturą

- Nie dodawaj prawdziwych sekretów do manifestów.
- Demo sekrety w `k8s/02-secret.yaml` traktuj jako wartości lokalne/testowe.
- Po zmianach w portach lub nazwach usług aktualizuj README.
- Po zmianach w kontenerach sprawdzaj Dockerfile i `.dockerignore`.
- Po zmianach w Kubernetes sprawdzaj zależności między ConfigMap, Secret, Deployment i Service.
- Nie zmieniaj architektury bez potrzeby; projekt jest edukacyjny i ma pozostać prosty do uruchomienia.

---

## 7. Komendy walidacyjne

Docker Compose:

```bash
docker compose config
docker compose up --build
```

Minikube:

```powershell
minikube start
npm run k8s:redeploy
npm run k8s:redeploy:open
kubectl get pods -n gralnia
kubectl get svc -n gralnia
```

Buildy lokalne:

```bash
npm run build
python -m compileall backend/app
```
