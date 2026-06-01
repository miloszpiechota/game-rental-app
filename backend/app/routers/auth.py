from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import uuid4
from ..database import get_db
from ..models import User
from ..schemas import AuthResponse, LoginRequest, RegisterRequest, UserRead
from ..security import create_token, get_current_user, hash_password, verify_password
from ..serializers import serialize_user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> dict:
    normalized_email = payload.email.lower()
    existing_user = db.scalar(select(User).where(User.email == normalized_email))

    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Konto z tym adresem e-mail już istnieje.")

    user = User(
        id=f"u-{uuid4().hex}",
        name=payload.name.strip(),
        email=normalized_email,
        role="klient",
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"token": create_token(user.id), "user": serialize_user(user)}


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nieprawidłowy e-mail lub hasło.")

    return {"token": create_token(user.id), "user": serialize_user(user)}


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> dict:
    return serialize_user(current_user)
