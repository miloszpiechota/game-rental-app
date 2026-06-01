import type { AppUser, BoardGame, RentalRecord } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface AuthResponse {
  token: string;
  user: AppUser;
}

const request = async <T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    let message = "Wystąpił błąd komunikacji z API.";

    try {
      const body = (await response.json()) as { detail?: string };
      message = body.detail ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }),

  me: (token: string) => request<AppUser>("/auth/me", {}, token),

  games: () => request<BoardGame[]>("/games"),

  createGame: (game: BoardGame, token: string) =>
    request<BoardGame>(
      "/games",
      {
        method: "POST",
        body: JSON.stringify(game)
      },
      token
    ),

  deleteGame: (gameId: string, token: string) =>
    request<void>(
      `/games/${gameId}`,
      {
        method: "DELETE"
      },
      token
    ),

  favoriteIds: (token: string) => request<{ favoriteIds: string[] }>("/games/favorites", {}, token),

  addFavorite: (gameId: string, token: string) =>
    request<{ favoriteIds: string[] }>(
      `/games/${gameId}/favorite`,
      {
        method: "POST"
      },
      token
    ),

  removeFavorite: (gameId: string, token: string) =>
    request<{ favoriteIds: string[] }>(
      `/games/${gameId}/favorite`,
      {
        method: "DELETE"
      },
      token
    ),

  rentals: (token: string) => request<RentalRecord[]>("/rentals/me", {}, token),

  borrow: (gameId: string, days: number, token: string) =>
    request<RentalRecord>(
      "/rentals",
      {
        method: "POST",
        body: JSON.stringify({ gameId, days })
      },
      token
    ),

  returnGame: (gameId: string, token: string) =>
    request<RentalRecord>(
      `/rentals/${gameId}/return`,
      {
        method: "POST"
      },
      token
    )
};
