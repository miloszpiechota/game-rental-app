import { FormEvent, useState } from "react";
import { PlusCircle } from "lucide-react";
import type { BoardGame, Complexity } from "../types";
import { coverImages } from "../assets/covers";

interface ManagerPanelProps {
  onAddGame: (game: BoardGame) => void;
}

type FormErrors = Partial<
  Record<
    "title" | "category" | "complexity" | "players" | "durationMinutes" | "tags" | "description",
    string
  >
>;

const categoryOptions = ["Familijne", "Strategiczne", "Kooperacyjne", "Ekonomiczne", "Taktyczne", "Przygodowe"];
const complexityOptions: Complexity[] = ["familijna", "średnia", "ekspercka"];
const coverKeys = Object.keys(coverImages) as Array<keyof typeof coverImages>;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export function ManagerPanel({ onAddGame }: ManagerPanelProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [complexity, setComplexity] = useState<Complexity>("familijna");
  const [playersMin, setPlayersMin] = useState(2);
  const [playersMax, setPlayersMax] = useState(4);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const nextErrors: FormErrors = {};
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const parsedTags = parseTags(tags);

    if (normalizedTitle.length < 3 || normalizedTitle.length > 80) {
      nextErrors.title = "Tytuł musi mieć od 3 do 80 znaków.";
    }

    if (!categoryOptions.includes(category)) {
      nextErrors.category = "Wybierz poprawną kategorię.";
    }

    if (!complexityOptions.includes(complexity)) {
      nextErrors.complexity = "Wybierz poprawny poziom trudności.";
    }

    if (
      !Number.isInteger(playersMin) ||
      !Number.isInteger(playersMax) ||
      playersMin < 1 ||
      playersMax < 1 ||
      playersMin > 12 ||
      playersMax > 12 ||
      playersMin > playersMax
    ) {
      nextErrors.players = "Liczba graczy musi być w zakresie 1-12, a minimum nie może być większe od maksimum.";
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes < 10 || durationMinutes > 240) {
      nextErrors.durationMinutes = "Czas gry musi być w zakresie 10-240 minut.";
    }

    if (parsedTags.length === 0 || parsedTags.length > 5 || parsedTags.some((tag) => tag.length < 2 || tag.length > 24)) {
      nextErrors.tags = "Podaj od 1 do 5 tagów, każdy od 2 do 24 znaków.";
    }

    if (normalizedDescription.length < 20 || normalizedDescription.length > 240) {
      nextErrors.description = "Opis musi mieć od 20 do 240 znaków.";
    }

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      normalizedTitle,
      normalizedDescription,
      parsedTags
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validate();

    if (!validation.isValid) {
      return;
    }

    const coverKey = coverKeys[Math.floor(Math.random() * coverKeys.length)];
    const nextGame: BoardGame = {
      id: `${slugify(validation.normalizedTitle)}-${Date.now()}`,
      title: validation.normalizedTitle,
      category,
      complexity,
      playersMin,
      playersMax,
      durationMinutes,
      rating: 4.0,
      cover: coverImages[coverKey],
      description: validation.normalizedDescription,
      tags: validation.parsedTags
    };

    onAddGame(nextGame);
    setTitle("");
    setTags("");
    setDescription("");
    setPlayersMin(2);
    setPlayersMax(4);
    setDurationMinutes(45);
    setErrors({});
  };

  return (
    <section className="manager-panel" aria-label="Panel pracownika">
      <div className="panel-heading">
        <PlusCircle size={22} />
        <div>
          <h2>Dodaj grę</h2>
          <p>Nowa pozycja w katalogu</p>
        </div>
      </div>

      <form className="manager-form" onSubmit={handleSubmit} noValidate>
        <label className="form-label">
          Tytuł gry
          <input
            className="form-control"
            value={title}
            minLength={3}
            maxLength={80}
            required
            aria-invalid={Boolean(errors.title)}
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <div className="manager-form-row">
          <label className="form-label">
            Kategoria
            <select
              className="form-select"
              value={category}
              aria-invalid={Boolean(errors.category)}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </label>

          <label className="form-label">
            Trudność
            <select
              className="form-select"
              value={complexity}
              aria-invalid={Boolean(errors.complexity)}
              onChange={(event) => setComplexity(event.target.value as Complexity)}
            >
              {complexityOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            {errors.complexity && <span className="field-error">{errors.complexity}</span>}
          </label>
        </div>

        <div className="manager-form-row compact">
          <label className="form-label">
            Min. Graczy
            <input
              className="form-control"
              type="number"
              min={1}
              max={12}
              value={playersMin}
              aria-invalid={Boolean(errors.players)}
              onChange={(event) => setPlayersMin(Number(event.target.value))}
            />
          </label>
          <label className="form-label">
            Max. Graczy
            <input
              className="form-control"
              type="number"
              min={1}
              max={12}
              value={playersMax}
              aria-invalid={Boolean(errors.players)}
              onChange={(event) => setPlayersMax(Number(event.target.value))}
            />
          </label>
          <label className="form-label">
            Minuty
            <input
              className="form-control"
              type="number"
              min={10}
              max={240}
              step={5}
              value={durationMinutes}
              aria-invalid={Boolean(errors.durationMinutes)}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
            />
          </label>
        </div>
        {errors.players && <span className="field-error">{errors.players}</span>}
        {errors.durationMinutes && <span className="field-error">{errors.durationMinutes}</span>}

        <label className="form-label">
          Tagi
          <input
            className="form-control"
            placeholder="np. karty, ekonomia, rodzinna"
            value={tags}
            maxLength={140}
            aria-invalid={Boolean(errors.tags)}
            onChange={(event) => setTags(event.target.value)}
          />
          {errors.tags && <span className="field-error">{errors.tags}</span>}
        </label>

        <label className="form-label">
          Opis
          <textarea
            className="form-control"
            rows={3}
            value={description}
            minLength={20}
            maxLength={240}
            aria-invalid={Boolean(errors.description)}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </label>

        <button className="btn btn-primary w-100" type="submit">
          <PlusCircle size={17} />
          Dodaj grę
        </button>
      </form>
    </section>
  );
}
