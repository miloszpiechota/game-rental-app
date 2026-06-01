import { useEffect, useMemo, useState } from "react";
import { AccountPage } from "./components/AccountPage";
import { AuthModal } from "./components/AuthModal";
import { Filters } from "./components/Filters";
import { GameCard } from "./components/GameCard";
import { GamePreviewModal } from "./components/GamePreviewModal";
import { Header } from "./components/Header";
import { StaffPage } from "./components/StaffPage";
import { StatsBar } from "./components/StatsBar";
import { DEMO_EMAIL, DEMO_PASSWORD } from "./data/users";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { ApiError, api } from "./lib/api";
import type { AppUser, AuthMode, BoardGame, FiltersState, RentalRecord } from "./types";

type AppView = "catalog" | "account" | "staff";

const initialFilters: FiltersState = {
  query: "",
  category: "",
  availability: "all",
  complexity: "",
  players: "",
  favoritesOnly: false
};

const matchesSearch = (game: BoardGame, query: string) => {
  if (!query.trim()) {
    return true;
  }

  const phrase = query.trim().toLowerCase();
  const haystack = [game.title, game.category, game.complexity, game.description, ...game.tags]
    .join(" ")
    .toLowerCase();

  return haystack.includes(phrase);
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nie udało się połączyć z API.";
};

function App() {
  const [games, setGames] = useState<BoardGame[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | undefined>();
  const [userFavoriteIds, setUserFavoriteIds] = useState<string[]>([]);
  const [rentalHistory, setRentalHistory] = useState<RentalRecord[]>([]);
  const [guestFavoriteIds, setGuestFavoriteIds] = useLocalStorageState<string[]>("gralnia.guestFavorites", []);
  const [token, setToken] = useLocalStorageState<string | null>("gralnia.apiToken", null);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [view, setView] = useState<AppView>("catalog");
  const [previewGameId, setPreviewGameId] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState("");

  const canOpenStaffPanel = currentUser?.role === "pracownik";
  const favoriteIds = currentUser ? userFavoriteIds : guestFavoriteIds;
  const previewGame = previewGameId ? games.find((game) => game.id === previewGameId) : undefined;

  const refreshGames = async () => {
    const nextGames = await api.games();
    setGames(nextGames);
  };

  const refreshUserData = async (activeToken: string) => {
    const [user, favorites, rentals] = await Promise.all([
      api.me(activeToken),
      api.favoriteIds(activeToken),
      api.rentals(activeToken)
    ]);

    setCurrentUser(user);
    setUserFavoriteIds(favorites.favoriteIds);
    setRentalHistory(rentals);
  };

  useEffect(() => {
    void refreshGames().catch((error) => setApiNotice(getErrorMessage(error)));
  }, []);

  useEffect(() => {
    if (!token) {
      setCurrentUser(undefined);
      setUserFavoriteIds([]);
      setRentalHistory([]);
      return;
    }

    void refreshUserData(token).catch((error) => {
      setApiNotice(getErrorMessage(error));
      setToken(null);
    });
  }, [setToken, token]);

  const categories = useMemo(
    () => Array.from(new Set(games.map((game) => game.category))).sort((left, right) => left.localeCompare(right)),
    [games]
  );

  const visibleGames = useMemo(() => {
    const selectedPlayers = filters.players ? Number(filters.players) : null;

    return games
      .filter((game) => matchesSearch(game, filters.query))
      .filter((game) => !filters.category || game.category === filters.category)
      .filter((game) => !filters.complexity || game.complexity === filters.complexity)
      .filter((game) => {
        if (!selectedPlayers) {
          return true;
        }

        return game.playersMin <= selectedPlayers && game.playersMax >= selectedPlayers;
      })
      .filter((game) => {
        if (filters.favoritesOnly && !favoriteIds.includes(game.id)) {
          return false;
        }

        if (filters.availability === "available") {
          return !game.borrowedBy;
        }

        if (filters.availability === "borrowed") {
          return Boolean(game.borrowedBy);
        }

        if (filters.availability === "mine") {
          return Boolean(currentUser && game.borrowedBy === currentUser.id);
        }

        return true;
      })
      .sort((left, right) => {
        const leftFavorite = favoriteIds.includes(left.id) ? 1 : 0;
        const rightFavorite = favoriteIds.includes(right.id) ? 1 : 0;

        if (leftFavorite !== rightFavorite) {
          return rightFavorite - leftFavorite;
        }

        if (Boolean(left.borrowedBy) !== Boolean(right.borrowedBy)) {
          return Number(Boolean(left.borrowedBy)) - Number(Boolean(right.borrowedBy));
        }

        return right.rating - left.rating;
      });
  }, [currentUser, favoriteIds, filters, games]);

  const handleToggleFavorite = async (gameId: string) => {
    if (!currentUser || !token) {
      setGuestFavoriteIds((currentFavorites) =>
        currentFavorites.includes(gameId)
          ? currentFavorites.filter((id) => id !== gameId)
          : [...currentFavorites, gameId]
      );
      return;
    }

    try {
      const response = userFavoriteIds.includes(gameId)
        ? await api.removeFavorite(gameId, token)
        : await api.addFavorite(gameId, token);
      setUserFavoriteIds(response.favoriteIds);
    } catch (error) {
      setApiNotice(getErrorMessage(error));
    }
  };

  const handleBorrow = async (gameId: string, days: number) => {
    if (!currentUser || !token) {
      setAuthMode("login");
      return;
    }

    try {
      await api.borrow(gameId, days, token);
      await Promise.all([refreshGames(), refreshUserData(token)]);
    } catch (error) {
      setApiNotice(getErrorMessage(error));
    }
  };

  const handleReturn = async (gameId: string) => {
    if (!currentUser || !token) {
      return;
    }

    try {
      await api.returnGame(gameId, token);
      await Promise.all([refreshGames(), refreshUserData(token)]);
    } catch (error) {
      setApiNotice(getErrorMessage(error));
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      setToken(response.token);
      setCurrentUser(response.user);
      setView("catalog");
      setApiNotice("");
      await Promise.all([refreshGames(), refreshUserData(response.token)]);
      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register(name, email, password);
      setToken(response.token);
      setCurrentUser(response.user);
      setView("catalog");
      setApiNotice("");
      await Promise.all([refreshGames(), refreshUserData(response.token)]);
      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  const handleAddGame = async (game: BoardGame) => {
    if (!token || !canOpenStaffPanel) {
      return;
    }

    try {
      await api.createGame(game, token);
      await refreshGames();
    } catch (error) {
      setApiNotice(getErrorMessage(error));
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!token || !canOpenStaffPanel) {
      return;
    }

    try {
      await api.deleteGame(gameId, token);
      setUserFavoriteIds((currentFavorites) => currentFavorites.filter((favoriteGameId) => favoriteGameId !== gameId));
      setGuestFavoriteIds((currentFavorites) => currentFavorites.filter((favoriteGameId) => favoriteGameId !== gameId));
      if (previewGameId === gameId) {
        setPreviewGameId(null);
      }
      await refreshGames();
    } catch (error) {
      setApiNotice(getErrorMessage(error));
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(undefined);
    setUserFavoriteIds([]);
    setRentalHistory([]);
    setView("catalog");
  };

  return (
    <div className="app-shell">
      <Header
        currentUser={currentUser}
        canOpenStaffPanel={canOpenStaffPanel}
        onOpenAuth={setAuthMode}
        onOpenProfile={() => setView("account")}
        onOpenStaffPanel={() => {
          if (canOpenStaffPanel) {
            setView("staff");
          }
        }}
        onLogout={handleLogout}
      />

      <main className="app-layout">
        {apiNotice && (
          <div className="api-alert" role="alert">
            {apiNotice}
          </div>
        )}

        {view === "staff" && canOpenStaffPanel ? (
          <StaffPage
            games={games}
            onAddGame={handleAddGame}
            onDeleteGame={handleDeleteGame}
            onBack={() => setView("catalog")}
          />
        ) : view === "account" && currentUser ? (
          <AccountPage
            currentUser={currentUser}
            games={games}
            rentalHistory={rentalHistory}
            onReturn={handleReturn}
            onOpenAuth={setAuthMode}
            onBack={() => setView("catalog")}
          />
        ) : (
          <section className="catalog-area">
            <StatsBar games={games} favoriteCount={favoriteIds.length} currentUser={currentUser} />

            <Filters
              categories={categories}
              filters={filters}
              filteredCount={visibleGames.length}
              totalCount={games.length}
              onChange={setFilters}
            />

            {visibleGames.length > 0 ? (
              <div className="game-grid">
                {visibleGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    currentUserId={currentUser?.id}
                    isFavorite={favoriteIds.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onBorrow={handleBorrow}
                    onReturn={handleReturn}
                    onOpenPreview={setPreviewGameId}
                    onAuthRequired={() => setAuthMode("login")}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>Brak wyników</h2>
                <p>Uruchom backend albo zmień wyszukiwanie i filtry.</p>
              </div>
            )}
          </section>
        )}
      </main>

      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={() => handleLogin(DEMO_EMAIL, DEMO_PASSWORD)}
      />
      <GamePreviewModal game={previewGame} currentUserId={currentUser?.id} onClose={() => setPreviewGameId(null)} />
    </div>
  );
}

export default App;
