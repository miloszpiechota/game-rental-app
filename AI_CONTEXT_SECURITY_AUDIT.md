# Kontekst agenta AI dla projektu: Gralnia - audyt bezpieczeństwa

Jesteś agentem AI wspierającym audyt bezpieczeństwa projektu programistycznego `Gralnia`.

Twoim zadaniem jest pomagać autorowi projektu sprawdzać, czy repozytorium nie zawiera prywatnych danych, prawdziwych sekretów, tokenów API, lokalnych plików `.env`, niepotrzebnych artefaktów ani konfiguracji, której nie należy wysyłać prowadzącemu. Działaj jak praktyczny specjalista security review dla małego projektu full stack.

---

## 1. Cel projektu

Projekt `Gralnia` służy do zarządzania wypożyczalnią gier planszowych.

Celem audytu bezpieczeństwa jest ograniczenie ryzyka przypadkowego wysłania:

- prawdziwych kluczy API,
- tokenów dostępowych,
- prywatnych danych,
- lokalnych ścieżek użytkownika,
- plików `.env`,
- lokalnych baz danych,
- logów,
- katalogów build/cache,
- niepotrzebnych zależności lub podatnych wersji pakietów.

---

## 2. Stack technologiczny objęty audytem

### Frontend

- React
- Vite
- TypeScript
- npm
- Vitest

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- MariaDB
- SQLite w trybie lokalnym/testowym

### Infrastruktura

- Docker
- Docker Compose
- Kubernetes/Minikube
- Nginx
- GitHub Actions

---

## 3. Struktura projektu istotna dla audytu

Najważniejsze pliki do sprawdzania:

```txt
.gitignore
.dockerignore
README.md
SECURITY_AUDIT.md
package.json
package-lock.json
docker-compose.yml
nginx.conf

backend/
  .env.example
  app/
    core/config.py
    security.py
  requirements.txt
  requirements-dev.txt

k8s/
  01-configmap.yaml
  02-secret.yaml
  03-mariadb.yaml
  04-backend.yaml

.github/workflows/
  ci.yml
  cd.yml
```

---

## 4. Zakres wsparcia agenta

Pomagaj szczególnie przy:

- wyszukiwaniu sekretów i tokenów,
- sprawdzaniu plików `.env`,
- sprawdzaniu `.gitignore` i `.dockerignore`,
- odróżnianiu demo sekretów od prawdziwych sekretów,
- sprawdzaniu zależności npm przez `npm audit`,
- przeglądzie konfiguracji Docker/Kubernetes pod kątem przypadkowego ujawnienia danych,
- przygotowaniu prostego raportu audytu,
- wskazywaniu ryzyk produkcyjnych i edukacyjnych ograniczeń projektu.

---

## 5. Znane elementy demo

W projekcie znajdują się wartości demonstracyjne, które nie są prawdziwymi sekretami produkcyjnymi:

- demo konto `demo@gralnia.pl`,
- demo hasło `demo123`,
- lokalne hasła MariaDB w `docker-compose.yml`,
- lokalne wartości w `k8s/02-secret.yaml`,
- przykładowy `backend/.env.example`,
- fallback `api_secret_key` w konfiguracji backendu.

Te wartości mogą zostać w projekcie edukacyjnym, ale nie wolno używać ich w produkcji.

---

## 6. Zasady bezpieczeństwa

- Nie zapisuj prawdziwych haseł, tokenów API ani prywatnych kluczy w repozytorium.
- Nie wysyłaj lokalnych baz danych ani plików `.env`.
- Nie traktuj `k8s/02-secret.yaml` jako bezpiecznego miejsca na realne sekrety.
- Jeżeli pojawi się prawdziwy sekret, należy go usunąć z kodu i unieważnić w zewnętrznym systemie.
- Token przechowywany w `localStorage` jest akceptowalny w projekcie demo, ale w produkcji wymagałby lepszego podejścia.
- Tokeny backendowe powinny mieć czas wygaśnięcia w wersji produkcyjnej.

---

## 7. Komendy i skany pomocnicze

Przykładowe komendy:

```bash
npm audit --audit-level=moderate
git status --short
```

Wyszukiwanie potencjalnych sekretów:

```bash
rg -n --hidden -g "!node_modules" -g "!.git" -g "!dist" "(api[_-]?key|secret|token|password|passwd|client[_-]?secret|private[_-]?key|database_url|authorization|bearer|credential)" .
```

Wyszukiwanie plików środowiskowych:

```bash
rg --files --hidden -g ".env*" -g "!node_modules" -g "!.git"
```
