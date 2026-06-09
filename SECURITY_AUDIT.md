# Security Audit

Date: 2026-06-09

## Scope

Checked the repository for committed private data, API keys, credentials, local machine paths, environment files, Docker/Kubernetes secret exposure, and JavaScript dependency vulnerabilities.

## Result

- No real private API keys or common private token formats were found.
- No local `.env` file is present in tracked/project files. Only `backend/.env.example` exists.
- The previous personal absolute Windows path in `README.md` was replaced with a generic path.
- `npm audit` now reports `0 vulnerabilities`.
- Frontend tests, frontend production build, and backend tests pass.

## Changes Made

- Hardened `.dockerignore` so local env files, databases, logs, lab files, caches, and virtual environments are not sent to the Docker build context.
- Removed the local user-specific path from `README.md`.
- Updated `package-lock.json` through `npm audit fix` to resolve a critical Vitest dev-dependency advisory.

## Remaining Notes

- The project contains demo/local credentials in `docker-compose.yml`, `k8s/02-secret.yaml`, `backend/.env.example`, and demo login seed data. These are not private real credentials, but they must not be reused in production.
- `backend/app/core/config.py` has a fallback API secret for local startup. A real deployment should always set `API_SECRET_KEY` from a secret manager or environment variable.
- Frontend auth stores the bearer token in `localStorage`. This is acceptable for a small course/demo app, but a production app should prefer short-lived tokens and/or secure HTTP-only cookies.
- Backend tokens are signed, but they do not expire. A production app should add token expiration and refresh/re-login behavior.
- Login/register endpoints do not include rate limiting. A production deployment should add throttling to reduce brute-force risk.
- Python dependency CVE scanning was not completed because `pip-audit`/`pipx` is not installed in the current environment.
