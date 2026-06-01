export type Complexity = "familijna" | "średnia" | "ekspercka";

export type AvailabilityFilter = "all" | "available" | "borrowed" | "mine";

export type UserRole = "klient" | "pracownik";

export interface BoardGame {
  id: string;
  title: string;
  category: string;
  complexity: Complexity;
  playersMin: number;
  playersMax: number;
  durationMinutes: number;
  rating: number;
  cover: string;
  description: string;
  tags: string[];
  borrowedBy?: string;
  borrowedAt?: string;
  dueDate?: string;
}

export interface RentalRecord {
  id: string;
  gameId: string;
  gameTitle: string;
  userId: string;
  userName: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  penaltyAtReturn?: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordDigest?: string;
  joinedAt: string;
}

export interface FiltersState {
  query: string;
  category: string;
  availability: AvailabilityFilter;
  complexity: "" | Complexity;
  players: string;
  favoritesOnly: boolean;
}

export type AuthMode = "login" | "register";
