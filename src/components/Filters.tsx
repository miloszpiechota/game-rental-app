import { Heart, Search, SlidersHorizontal } from "lucide-react";
import type { AvailabilityFilter, Complexity, FiltersState } from "../types";

interface FiltersProps {
  categories: string[];
  filters: FiltersState;
  filteredCount: number;
  totalCount: number;
  onChange: (filters: FiltersState) => void;
}

const availabilityOptions: Array<{ value: AvailabilityFilter; label: string }> = [
  { value: "all", label: "Wszystkie" },
  { value: "available", label: "Dostępne" },
  { value: "borrowed", label: "Zajęte" },
  { value: "mine", label: "Moje" }
];

const complexityOptions: Array<{ value: "" | Complexity; label: string }> = [
  { value: "", label: "Każdy poziom" },
  { value: "familijna", label: "Familijna" },
  { value: "średnia", label: "Średnia" },
  { value: "ekspercka", label: "Ekspercka" }
];

export function Filters({ categories, filters, filteredCount, totalCount, onChange }: FiltersProps) {
  const patchFilters = (patch: Partial<FiltersState>) => onChange({ ...filters, ...patch });

  return (
    <section className="filter-surface" aria-label="Filtry katalogu">
      <div className="filter-heading">
        <SlidersHorizontal size={20} />
        <div>
          <h2>Katalog gier</h2>
          <p>
            {filteredCount} z {totalCount} pozycji
          </p>
        </div>
      </div>

      <div className="filter-grid">
        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            className="form-control"
            placeholder="Szukaj po tytule, tagu lub opisie"
            value={filters.query}
            onChange={(event) => patchFilters({ query: event.target.value })}
          />
        </label>

        <select
          className="form-select"
          value={filters.category}
          aria-label="Kategoria"
          onChange={(event) => patchFilters({ category: event.target.value })}
        >
          <option value="">Wszystkie kategorie</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={filters.complexity}
          aria-label="Poziom trudności"
          onChange={(event) => patchFilters({ complexity: event.target.value as FiltersState["complexity"] })}
        >
          {complexityOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={filters.players}
          aria-label="Liczba graczy"
          onChange={(event) => patchFilters({ players: event.target.value })}
        >
          <option value="">Dowolna liczba graczy</option>
          <option value="1">1 gracz</option>
          <option value="2">2 graczy</option>
          <option value="4">4 graczy</option>
          <option value="6">6 graczy</option>
        </select>
      </div>

      <div className="availability-tabs" role="group" aria-label="Dostępność">
        {availabilityOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`availability-tab ${filters.availability === option.value ? "is-active" : ""}`}
            onClick={() => patchFilters({ availability: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="favorite-filter">
        <input
          className="form-check-input"
          type="checkbox"
          checked={filters.favoritesOnly}
          onChange={(event) => patchFilters({ favoritesOnly: event.target.checked })}
        />
        <Heart size={17} />
        Tylko ulubione
      </label>
    </section>
  );
}
