import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ManagerPanel } from "./ManagerPanel";

describe("ManagerPanel", () => {
  const coverUrl = "https://images.pexels.com/photos/8111365/pexels-photo-8111365.jpeg";

  it("shows validation errors for empty invalid submit", () => {
    render(<ManagerPanel onAddGame={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /dodaj grę/i }));

    expect(screen.getByText(/tytuł musi mieć/i)).toBeInTheDocument();
    expect(screen.getByText(/podaj poprawny url obrazu/i)).toBeInTheDocument();
    expect(screen.getByText(/opis musi mieć/i)).toBeInTheDocument();
    expect(screen.getByText(/podaj od 1 do 5 tagów/i)).toBeInTheDocument();
  });

  it("rejects a cover value that is not an image URL", () => {
    render(<ManagerPanel onAddGame={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/tytuł gry/i), { target: { value: "Nowa Gra" } });
    fireEvent.change(screen.getByLabelText(/adres url okladki/i), { target: { value: "not-a-url" } });
    fireEvent.change(screen.getByLabelText(/tagi/i), { target: { value: "strategia, rodzinna" } });
    fireEvent.change(screen.getByLabelText(/opis/i), {
      target: { value: "Opis gry ma wystarczajaca dlugosc do zapisania w katalogu." }
    });

    fireEvent.click(screen.getByRole("button", { name: /dodaj grę/i }));

    expect(screen.getByText(/podaj poprawny url obrazu/i)).toBeInTheDocument();
  });

  it("submits normalized game data when form is valid", () => {
    const onAddGame = vi.fn();
    render(<ManagerPanel onAddGame={onAddGame} />);

    fireEvent.change(screen.getByLabelText(/tytuł gry/i), { target: { value: "  Nowa Gra  " } });
    fireEvent.change(screen.getByLabelText(/adres url okladki/i), { target: { value: `  ${coverUrl}  ` } });
    fireEvent.change(screen.getByLabelText(/tagi/i), { target: { value: "strategia, rodzinna" } });
    fireEvent.change(screen.getByLabelText(/opis/i), {
      target: { value: "Opis gry ma wystarczającą długość do zapisania w katalogu." }
    });

    fireEvent.click(screen.getByRole("button", { name: /dodaj grę/i }));

    expect(onAddGame).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Nowa Gra",
        cover: coverUrl,
        tags: ["strategia", "rodzinna"],
        playersMin: 2,
        playersMax: 4,
        durationMinutes: 45
      })
    );
  });
});
