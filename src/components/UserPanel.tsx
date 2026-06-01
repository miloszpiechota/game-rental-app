import { CalendarCheck, LogIn, RotateCcw, ShieldAlert, UserRound } from "lucide-react";
import { formatDate } from "../lib/dates";
import { formatPenalty, getRentalSummary } from "../lib/rentalRules";
import type { AppUser, AuthMode, BoardGame } from "../types";

interface UserPanelProps {
  currentUser?: AppUser;
  games: BoardGame[];
  onReturn: (gameId: string) => void;
  onOpenAuth: (mode: AuthMode) => void;
}

export function UserPanel({ currentUser, games, onReturn, onOpenAuth }: UserPanelProps) {
  const borrowedGames = currentUser ? games.filter((game) => game.borrowedBy === currentUser.id) : [];
  const totalPenalty = borrowedGames.reduce((sum, game) => {
    if (!game.dueDate) {
      return sum;
    }

    return sum + getRentalSummary(game.dueDate).penalty;
  }, 0);

  return (
    <aside className="user-panel" aria-label="Panel użytkownika">
      <div className="panel-heading">
        <UserRound size={22} />
        <div>
          <h2>Panel użytkownika</h2>
          <p>{currentUser ? currentUser.email : "Brak aktywnej sesji"}</p>
        </div>
      </div>

      {!currentUser ? (
        <div className="signed-out-box">
          <button className="btn btn-dark w-100" type="button" onClick={() => onOpenAuth("login")}>
            <LogIn size={17} />
            Zaloguj się
          </button>
          <button className="btn btn-outline-dark w-100" type="button" onClick={() => onOpenAuth("register")}>
            Rejestracja
          </button>
        </div>
      ) : (
        <>
          <div className="panel-summary">
            <div>
              <span>Aktywne gry</span>
              <strong>{borrowedGames.length}</strong>
            </div>
            <div className={totalPenalty > 0 ? "has-penalty" : ""}>
              <span>Szacowana kara</span>
              <strong>{formatPenalty(totalPenalty)}</strong>
            </div>
          </div>

          <div className="borrowed-list">
            {borrowedGames.length === 0 ? (
              <p className="empty-copy">Brak aktywnych wypożyczeń.</p>
            ) : (
              borrowedGames.map((game) => {
                const summary = game.dueDate ? getRentalSummary(game.dueDate) : null;

                return (
                  <article key={game.id} className="borrowed-item">
                    <div>
                      <h3>{game.title}</h3>
                      {game.dueDate && (
                        <p>
                          <CalendarCheck size={15} />
                          {formatDate(game.dueDate)}
                        </p>
                      )}
                    </div>

                    {summary?.isOverdue ? (
                      <div className="penalty-alert">
                        <ShieldAlert size={16} />
                        {summary.overdueDays} dni po terminie, {formatPenalty(summary.penalty)}
                      </div>
                    ) : summary ? (
                      <span className="days-left">Pozostało {summary.daysLeft} dni</span>
                    ) : null}

                    <button className="btn btn-sm btn-outline-success" type="button" onClick={() => onReturn(game.id)}>
                      <RotateCcw size={15} />
                      Oddaj
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </>
      )}
    </aside>
  );
}
