from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from .core.config import get_settings
from .database import get_db
from .models import User


bearer_scheme = HTTPBearer(auto_error=False)
PASSWORD_ITERATIONS = 210_000


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS)
    return "pbkdf2_sha256${}${}${}".format(
        PASSWORD_ITERATIONS,
        base64.urlsafe_b64encode(salt).decode("utf-8"),
        base64.urlsafe_b64encode(password_hash).decode("utf-8"),
    )


def verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, iterations, salt, expected_hash = password_hash.split("$", 3)
    except ValueError:
        return False

    if algorithm != "pbkdf2_sha256":
        return False

    calculated_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        base64.urlsafe_b64decode(salt.encode("utf-8")),
        int(iterations),
    )

    return hmac.compare_digest(base64.urlsafe_b64encode(calculated_hash).decode("utf-8"), expected_hash)


def create_token(user_id: str) -> str:
    settings = get_settings()
    issued_at = str(int(datetime.utcnow().timestamp()))
    nonce = secrets.token_urlsafe(10)
    payload = f"{user_id}:{issued_at}:{nonce}".encode("utf-8")
    signature = hmac.new(settings.api_secret_key.encode("utf-8"), payload, hashlib.sha256).digest()
    return ".".join(
        [
            base64.urlsafe_b64encode(payload).decode("utf-8").rstrip("="),
            base64.urlsafe_b64encode(signature).decode("utf-8").rstrip("="),
        ]
    )


def _decode_part(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def read_token_user_id(token: str) -> str | None:
    settings = get_settings()

    try:
        payload_part, signature_part = token.split(".", 1)
        payload = _decode_part(payload_part)
        signature = _decode_part(signature_part)
    except Exception:
        return None

    expected_signature = hmac.new(settings.api_secret_key.encode("utf-8"), payload, hashlib.sha256).digest()

    if not hmac.compare_digest(signature, expected_signature):
        return None

    try:
        user_id, _issued_at, _nonce = payload.decode("utf-8").split(":", 2)
    except ValueError:
        return None

    return user_id


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Brak tokenu autoryzacji.")

    user_id = read_token_user_id(credentials.credentials)

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nieprawidłowy token.")

    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Użytkownik nie istnieje.")

    return user


def require_staff(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "pracownik":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Wymagana rola pracownika.")

    return current_user
