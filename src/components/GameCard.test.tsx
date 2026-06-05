import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameCard } from "./GameCard";
import type { BoardGame } from "../types";

const game: BoardGame = {
  id: "game-1",
  title: "Testowa Gra",
  category: "Familijne",
  complexity: "familijna",
  playersMin: 2,
  playersMax: 4,
  durationMinutes: 45,
  rating: 4.4,
  cover: "https://images.pexels.com/photos/8111365/pexels-photo-8111365.jpeg",
  description: "Krótki opis testowej gry planszowej.",
  tags: ["rodzinna", "karty"]
};

const defaultProps = {
  currentUserId: "u-1",
  isFavorite: false,
  onToggleFavorite: vi.fn(),
  onBorrow: vi.fn(),
  onReturn: vi.fn(),
  onOpenPreview: vi.fn(),
  onAuthRequired: vi.fn()
};

describe("GameCard", () => {
  it("opens preview when the card body is clicked", () => {
    const onOpenPreview = vi.fn();
    const { container } = render(<GameCard {...defaultProps} game={game} onOpenPreview={onOpenPreview} />);

    fireEvent.click(container.querySelector(".game-card")!);

    expect(onOpenPreview).toHaveBeenCalledWith("game-1");
  });

  it("does not open preview when favorite button is clicked", () => {
    const onToggleFavorite = vi.fn();
    const onOpenPreview = vi.fn();
    render(
      <GameCard
        {...defaultProps}
        game={game}
        onToggleFavorite={onToggleFavorite}
        onOpenPreview={onOpenPreview}
      />
    );

    fireEvent.click(screen.getByLabelText(/dodaj do ulubionych/i));

    expect(onToggleFavorite).toHaveBeenCalledWith("game-1");
    expect(onOpenPreview).not.toHaveBeenCalled();
  });

  it("requests authentication before borrowing when user is anonymous", () => {
    const onAuthRequired = vi.fn();
    render(<GameCard {...defaultProps} currentUserId={undefined} game={game} onAuthRequired={onAuthRequired} />);

    fireEvent.click(screen.getByRole("button", { name: /wypożycz/i }));

    expect(onAuthRequired).toHaveBeenCalled();
  });
});
