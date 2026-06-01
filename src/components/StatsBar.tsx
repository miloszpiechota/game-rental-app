import { CalendarClock, Heart, LibraryBig, ShieldAlert } from "lucide-react";
import { formatPenalty, getRentalSummary } from "../lib/rentalRules";
import type { AppUser, BoardGame } from "../types";

interface StatsBarProps {
  games: BoardGame[];
  favoriteCount: number;
  currentUser?: AppUser;
}

export function StatsBar({ games, favoriteCount, currentUser }: StatsBarProps) {
  const availableCount = games.filter((game) => !game.borrowedBy).length;
  const myGames = currentUser ? games.filter((game) => game.borrowedBy === currentUser.id) : [];
  const overduePenalty = myGames.reduce((sum, game) => {
    if (!game.dueDate) {
      return sum;
    }

    return sum + getRentalSummary(game.dueDate).penalty;
  }, 0);

  return (
    <section className="metrics-grid" aria-label="Podsumowanie wypożyczalni">
      <div className="metric-tile">
        <LibraryBig size={21} />
        <span>Dostępne</span>
        <strong>{availableCount}</strong>
      </div>
      <div className="metric-tile">
        <CalendarClock size={21} />
        <span>Wypożyczone</span>
        <strong>{myGames.length}</strong>
      </div>
      <div className="metric-tile">
        <Heart size={21} />
        <span>Ulubione</span>
        <strong>{favoriteCount}</strong>
      </div>
      <div className="metric-tile penalty-tile">
        <ShieldAlert size={21} />
        <span>Kary</span>
        <strong>{formatPenalty(overduePenalty)}</strong>
      </div>
    </section>
  );
}
