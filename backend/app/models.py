from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(180), unique=True, index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="klient", nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    favorites: Mapped[list["Favorite"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    rentals: Mapped[list["Rental"]] = relationship(back_populates="user")


class Game(Base):
    __tablename__ = "games"

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    complexity: Mapped[str] = mapped_column(String(32), nullable=False)
    players_min: Mapped[int] = mapped_column(Integer, nullable=False)
    players_max: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.0, nullable=False)
    cover: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tags_csv: Mapped[str] = mapped_column(Text, default="", nullable=False)
    deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    favorites: Mapped[list["Favorite"]] = relationship(back_populates="game", cascade="all, delete-orphan")
    rentals: Mapped[list["Rental"]] = relationship(back_populates="game")


class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint("user_id", "game_id", name="uq_favorites_user_game"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    game_id: Mapped[str] = mapped_column(ForeignKey("games.id"), nullable=False)

    user: Mapped[User] = relationship(back_populates="favorites")
    game: Mapped[Game] = relationship(back_populates="favorites")


class Rental(Base):
    __tablename__ = "rentals"

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    game_id: Mapped[str] = mapped_column(ForeignKey("games.id"), nullable=False)
    game_title: Mapped[str] = mapped_column(String(160), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    user_name: Mapped[str] = mapped_column(String(120), nullable=False)
    borrowed_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    returned_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    penalty_at_return: Mapped[float | None] = mapped_column(Float, nullable=True)

    user: Mapped[User] = relationship(back_populates="rentals")
    game: Mapped[Game] = relationship(back_populates="rentals")
