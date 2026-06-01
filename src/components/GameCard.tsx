import { CalendarDays, Heart, RotateCcw, Star, Timer, UsersRound } from "lucide-react";
import { MouseEvent, useState } from "react";
import { formatDate } from "../lib/dates";
import { RENTAL_OPTIONS, getRentalSummary } from "../lib/rentalRules";
import type { BoardGame } from "../types";

interface GameCardProps {
  game: BoardGame;
  currentUserId?: string;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onBorrow: (gameId: string, days: number) => void;
  onReturn: (gameId: string) => void;
  onOpenPreview: (gameId: string) => void;
  onAuthRequired: () => void;
}

export function GameCard({
  game,
  currentUserId,
  isFavorite,
  onToggleFavorite,
  onBorrow,
  onReturn,
  onOpenPreview,
  onAuthRequired
}: GameCardProps) {
  const [days, setDays] = useState(14);
  const isBorrowed = Boolean(game.borrowedBy);
  const isMine = Boolean(currentUserId && game.borrowedBy === currentUserId);
  const rentalSummary = game.dueDate ? getRentalSummary(game.dueDate) : null;

  const handleBorrow = () => {
    if (!currentUserId) {
      onAuthRequired();
      return;
    }

    onBorrow(game.id, days);
  };

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target;

    if (target instanceof HTMLElement && target.closest("button, input, select, textarea, a, label")) {
      return;
    }

    onOpenPreview(game.id);
  };

  return (
    <article className={`game-card ${isBorrowed ? "is-borrowed" : ""}`} onClick={handleCardClick}>
      <div className="cover-wrap">
        <img className="game-cover-image" src={game.cover} alt={`Okładka gry ${game.title}`} loading="lazy" decoding="async" />
        <button
          className={`favorite-button ${isFavorite ? "is-active" : ""}`}
          type="button"
          aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          onClick={() => onToggleFavorite(game.id)}
        >
          <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="game-card-body">
        <div className="game-card-topline">
          <span className={`status-pill ${isBorrowed ? "busy" : "available"}`}>
            {isBorrowed ? "Zajęta" : "Dostępna"}
          </span>
          <span className="rating-pill">
            <Star size={15} fill="currentColor" />
            {game.rating.toFixed(1)}
          </span>
        </div>

        <h3>{game.title}</h3>
        <p>{game.description}</p>

        <div className="game-meta">
          <span>
            <UsersRound size={16} />
            {game.playersMin}-{game.playersMax}
          </span>
          <span>
            <Timer size={16} />
            {game.durationMinutes} min
          </span>
          <span>{game.complexity}</span>
        </div>

        <div className="tag-row">
          {game.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="rental-area">
          {isMine && game.dueDate ? (
            <div className={`due-box ${rentalSummary?.isOverdue ? "is-overdue" : ""}`}>
              <CalendarDays size={17} />
              <span>
                Zwrot: <strong>{formatDate(game.dueDate)}</strong>
              </span>
            </div>
          ) : (
            <label className="due-select">
              <CalendarDays size={17} />
              <select
                className="form-select form-select-sm"
                value={days}
                disabled={isBorrowed}
                onChange={(event) => setDays(Number(event.target.value))}
              >
                {RENTAL_OPTIONS.map((option) => (
                  <option key={option.days} value={option.days}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {isMine ? (
            <button className="btn btn-outline-success w-100" type="button" onClick={() => onReturn(game.id)}>
              <RotateCcw size={17} />
              Oddaj grę
            </button>
          ) : isBorrowed ? (
            <button className="btn btn-secondary w-100" type="button" disabled>
              Gra jest zajęta
            </button>
          ) : (
            <button className="btn btn-primary w-100" type="button" onClick={handleBorrow}>
              Wypożycz
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
