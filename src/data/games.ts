import type { BoardGame } from "../types";
import { subtractDays } from "../lib/dates";
import { coverImages } from "../assets/covers";
import { DEMO_USER_ID } from "./users";

export const getSeedGames = (): BoardGame[] => {
  const now = new Date();

  return [
    {
      id: "galaxy-run",
      title: "Wyprawa przez Galaktykę",
      category: "Strategiczne",
      complexity: "średnia",
      playersMin: 2,
      playersMax: 4,
      durationMinutes: 90,
      rating: 4.8,
      cover: coverImages.galaxy,
      description: "Rozbudowa floty, handel surowcami i rywalizacja o sektory mapy.",
      tags: ["kosmos", "ekonomia", "mapa"]
    },
    {
      id: "north-castles",
      title: "Zamki Północy",
      category: "Euro",
      complexity: "ekspercka",
      playersMin: 2,
      playersMax: 5,
      durationMinutes: 120,
      rating: 4.7,
      cover: coverImages.castle,
      description: "Planowanie tur, zarządzanie pracownikami i budowa zimowego królestwa.",
      tags: ["worker placement", "budowanie", "zasoby"]
    },
    {
      id: "rivals-cafe",
      title: "Kawiarnia Rywali",
      category: "Familijne",
      complexity: "familijna",
      playersMin: 2,
      playersMax: 6,
      durationMinutes: 35,
      rating: 4.2,
      cover: coverImages.cafe,
      description: "Szybka gra karciana o obsłudze klientów i sprytnym blokowaniu przeciwników.",
      tags: ["karty", "szybka", "rodzinna"]
    },
    {
      id: "ocean-tacticians",
      title: "Ocean Strategów",
      category: "Strategiczne",
      complexity: "średnia",
      playersMin: 1,
      playersMax: 4,
      durationMinutes: 75,
      rating: 4.6,
      cover: coverImages.ocean,
      description: "Eksploracja archipelagu, kontrola szlaków i taktyczne zagrywanie akcji.",
      tags: ["solo", "eksploracja", "kontrola"]
    },
    {
      id: "library-mystery",
      title: "Tajemnice Biblioteki",
      category: "Kooperacyjne",
      complexity: "familijna",
      playersMin: 2,
      playersMax: 5,
      durationMinutes: 50,
      rating: 4.4,
      cover: coverImages.library,
      description: "Wspólne śledztwo, dedukcja i odkrywanie kolejnych rozdziałów sprawy.",
      tags: ["dedukcja", "kooperacja", "przygoda"]
    },
    {
      id: "rail-trails",
      title: "Kolejowe Szlaki",
      category: "Familijne",
      complexity: "familijna",
      playersMin: 2,
      playersMax: 5,
      durationMinutes: 45,
      rating: 4.5,
      cover: coverImages.rail,
      description: "Budowanie połączeń, kompletowanie kontraktów i walka o najlepsze trasy.",
      tags: ["trasy", "rodzinna", "mapa"],
      borrowedBy: DEMO_USER_ID,
      borrowedAt: subtractDays(now, 35).toISOString(),
      dueDate: subtractDays(now, 3).toISOString()
    },
    {
      id: "forest-kingdom",
      title: "Leśne Królestwo",
      category: "Kooperacyjne",
      complexity: "średnia",
      playersMin: 1,
      playersMax: 4,
      durationMinutes: 65,
      rating: 4.3,
      cover: coverImages.forest,
      description: "Ochrona polany, asymetryczne role i zmienne cele scenariuszy.",
      tags: ["kooperacja", "asymetria", "scenariusze"]
    },
    {
      id: "merchant-chronicles",
      title: "Kroniki Kupców",
      category: "Ekonomiczne",
      complexity: "ekspercka",
      playersMin: 2,
      playersMax: 4,
      durationMinutes: 110,
      rating: 4.6,
      cover: coverImages.market,
      description: "Kontrakty, aukcje, magazyny i długofalowe decyzje ekonomiczne.",
      tags: ["aukcje", "handel", "zasoby"]
    },
    {
      id: "cyber-city",
      title: "Cyber Miasto",
      category: "Taktyczne",
      complexity: "średnia",
      playersMin: 2,
      playersMax: 4,
      durationMinutes: 70,
      rating: 4.1,
      cover: coverImages.cyber,
      description: "Rywalizacja frakcji, kontrola dzielnic i mocne efekty kart.",
      tags: ["taktyka", "karty", "kontrola"]
    },
    {
      id: "treasure-island",
      title: "Wyspa Skarbów",
      category: "Przygodowe",
      complexity: "familijna",
      playersMin: 2,
      playersMax: 6,
      durationMinutes: 40,
      rating: 4.0,
      cover: coverImages.island,
      description: "Poszukiwanie skarbów, blef i szybkie decyzje nad mapą wyspy.",
      tags: ["blef", "przygoda", "rodzinna"]
    }
  ];
};
