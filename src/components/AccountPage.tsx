import { ArrowLeft, UserRound } from "lucide-react";
import { RentalHistory } from "./RentalHistory";
import { UserPanel } from "./UserPanel";
import type { AppUser, AuthMode, BoardGame, RentalRecord } from "../types";

interface AccountPageProps {
  currentUser?: AppUser;
  games: BoardGame[];
  rentalHistory: RentalRecord[];
  onReturn: (gameId: string) => void;
  onOpenAuth: (mode: AuthMode) => void;
  onBack: () => void;
}

export function AccountPage({ currentUser, games, rentalHistory, onReturn, onOpenAuth, onBack }: AccountPageProps) {
  return (
    <section className="account-page" aria-label="Strona użytkownika">
      <div className="account-page-header">
        <button className="btn btn-outline-dark" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Wróć do katalogu
        </button>

        <div className="account-title">
          <UserRound size={24} />
          <div>
            <h1>Moje konto</h1>
            <p>{currentUser ? currentUser.email : "Zaloguj się, aby zobaczyć wypożyczenia."}</p>
          </div>
        </div>
      </div>

      <div className="account-grid">
        <UserPanel currentUser={currentUser} games={games} onReturn={onReturn} onOpenAuth={onOpenAuth} />
        {currentUser && <RentalHistory records={rentalHistory} />}
      </div>
    </section>
  );
}
