import { ArrowLeft, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { ManagerPanel } from "./ManagerPanel";
import type { BoardGame } from "../types";

interface StaffPageProps {
  games: BoardGame[];
  onAddGame: (game: BoardGame) => void;
  onDeleteGame: (gameId: string) => void;
  onBack: () => void;
}

export function StaffPage({ games, onAddGame, onDeleteGame, onBack }: StaffPageProps) {
  const handleDelete = (game: BoardGame) => {
    if (game.borrowedBy) {
      return;
    }

    if (window.confirm(`Czy na pewno usunąć grę "${game.title}" z katalogu?`)) {
      onDeleteGame(game.id);
    }
  };

  return (
    <section className="staff-page" aria-label="Panel pracownika">
      <div className="staff-page-header">
        <button className="btn btn-outline-dark" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Wróć do katalogu
        </button>

        <div className="staff-title">
          <ShieldCheck size={24} />
          <div>
            <h1>Panel Pracownika</h1>
            <p>Zarządzanie katalogiem wypożyczalni</p>
          </div>
        </div>
      </div>

      <div className="staff-grid">
        <ManagerPanel onAddGame={onAddGame} />

        <section className="staff-inventory" aria-label="Lista gier w katalogu">
          <div className="panel-heading">
            <ShieldCheck size={22} />
            <div>
              <h2>Katalog pracownika</h2>
              <p>{games.length} pozycji w systemie</p>
            </div>
          </div>

          <div className="staff-game-list">
            {games.map((game) => {
              const isBorrowed = Boolean(game.borrowedBy);

              return (
                <article key={game.id} className="staff-game-item">
                  <img src={game.cover} alt="" loading="lazy" />
                  <div className="staff-game-copy">
                    <h3>{game.title}</h3>
                    <p>
                      {game.category} · {game.playersMin}-{game.playersMax} graczy · {game.durationMinutes} min
                    </p>
                    <span className={`staff-game-status ${isBorrowed ? "busy" : "available"}`}>
                      {isBorrowed ? "Wypożyczona - usuń dopiero po zwrocie" : "Dostępna do usunięcia"}
                    </span>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    disabled={isBorrowed}
                    title={isBorrowed ? "Nie można usunąć gry z aktywnym wypożyczeniem" : "Usuń grę"}
                    onClick={() => handleDelete(game)}
                  >
                    {isBorrowed ? <Lock size={15} /> : <Trash2 size={15} />}
                    Usuń
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
