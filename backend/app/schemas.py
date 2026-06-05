from datetime import datetime
from urllib.parse import urlparse
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRead(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    joinedAt: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserRead


class RegisterRequest(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class GameCreate(BaseModel):
    title: str = Field(min_length=3, max_length=80)
    category: str = Field(min_length=2, max_length=80)
    complexity: str
    playersMin: int = Field(ge=1, le=12)
    playersMax: int = Field(ge=1, le=12)
    durationMinutes: int = Field(ge=10, le=240)
    rating: float = Field(default=4.0, ge=1.0, le=5.0)
    cover: str = Field(min_length=1, max_length=500)
    description: str = Field(min_length=20, max_length=240)
    tags: list[str] = Field(min_length=1, max_length=5)

    @field_validator("cover")
    @classmethod
    def validate_cover_url(cls, value: str) -> str:
        normalized = value.strip()
        parsed_url = urlparse(normalized)

        if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
            raise ValueError("Podaj poprawny adres URL obrazu.")

        if not parsed_url.path.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif")):
            raise ValueError("Adres URL musi wskazywac plik obrazu.")

        return normalized

    @field_validator("complexity")
    @classmethod
    def validate_complexity(cls, value: str) -> str:
        allowed = {"familijna", "średnia", "ekspercka"}
        if value not in allowed:
            raise ValueError("Nieprawidłowy poziom trudności.")
        return value

    @field_validator("playersMax")
    @classmethod
    def validate_players_range(cls, players_max: int, info) -> int:
        players_min = info.data.get("playersMin")
        if players_min is not None and players_max < players_min:
            raise ValueError("Maksymalna liczba graczy nie może być mniejsza od minimalnej.")
        return players_max

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, tags: list[str]) -> list[str]:
        normalized = [tag.strip() for tag in tags if tag.strip()]
        if not normalized:
            raise ValueError("Podaj co najmniej jeden tag.")
        if len(normalized) > 5:
            raise ValueError("Maksymalnie 5 tagów.")
        if any(len(tag) < 2 or len(tag) > 24 for tag in normalized):
            raise ValueError("Tag musi mieć od 2 do 24 znaków.")
        return normalized


class GameRead(GameCreate):
    id: str
    borrowedBy: str | None = None
    borrowedAt: datetime | None = None
    dueDate: datetime | None = None


class FavoriteIdsResponse(BaseModel):
    favoriteIds: list[str]


class BorrowRequest(BaseModel):
    gameId: str
    days: int = Field(ge=1, le=30)


class RentalRead(BaseModel):
    id: str
    gameId: str
    gameTitle: str
    userId: str
    userName: str
    borrowedAt: datetime
    dueDate: datetime
    returnedAt: datetime | None = None
    penaltyAtReturn: float | None = None
