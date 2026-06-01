import { CalendarDays, Clock3, UsersRound, X } from "lucide-react";
import { formatDate } from "../lib/dates";
import type { BoardGame } from "../types";

interface GamePreviewModalProps {
  game?: BoardGame;
  currentUserId?: string;
  onClose: () => void;
}

export function GamePreviewModal({ game, currentUserId, onClose }: GamePreviewModalProps) {
  if (!game) {
    return null;
  }

  const isBorrowed = Boolean(game.borrowedBy);
  const isMine = Boolean(currentUserId && game.borrowedBy === currentUserId);

  return (
    <div className="modal-backdrop-custom" role="presentation" onClick={onClose}>
      <section
        className="game-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="icon-button close-button" type="button" aria-label="Zamknij" onClick={onClose}>
          <X size={20} />
        </button>

        <img className="game-preview-cover" src={game.cover} alt={`Okładka gry ${game.title}`} />

        <div className="game-preview-content">
          <span className={`status-pill ${isBorrowed ? "busy" : "available"}`}>
            {isMine ? "Wypożyczona przez Ciebie" : isBorrowed ? "Aktualnie zajęta" : "Dostępna"}
          </span>

          <h2 id="game-preview-title">{game.title}</h2>
          <p>{game.description}</p>

          <div className="preview-meta-grid">
            <span>
              <UsersRound size={17} />
              {game.playersMin}-{game.playersMax} graczy
            </span>
            <span>
              <Clock3 size={17} />
              {game.durationMinutes} min
            </span>
            <span>{game.category}</span>
            <span>{game.complexity}</span>
          </div>

          {game.dueDate && (
            <div className="preview-due-date">
              <CalendarDays size={17} />
              Zwrot: {formatDate(game.dueDate)}
            </div>
          )}

          <div className="tag-row">
            {game.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
