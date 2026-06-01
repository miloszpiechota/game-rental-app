from datetime import datetime, timedelta
from urllib.parse import quote
from sqlalchemy.orm import Session
from .models import Game, Rental, User
from .security import hash_password
from .utils import new_id, tags_to_csv


DEMO_USER_ID = "u-demo"
DEMO_EMAIL = "demo@gralnia.pl"
DEMO_PASSWORD = "demo123"


def cover_svg(label: str, start: str, end: str, accent: str) -> str:
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 264">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="{start}"/>
          <stop offset="1" stop-color="{end}"/>
        </linearGradient>
      </defs>
      <rect width="352" height="264" rx="18" fill="url(#bg)"/>
      <rect x="24" y="24" width="304" height="216" rx="16" fill="none" stroke="#fff" stroke-width="2" opacity=".28"/>
      <circle cx="246" cy="92" r="38" fill="{accent}" opacity=".9"/>
      <rect x="58" y="126" width="86" height="86" rx="12" fill="#fff" opacity=".72"/>
      <rect x="156" y="126" width="86" height="86" rx="12" fill="{accent}" opacity=".68"/>
      <text x="34" y="62" font-family="Arial" font-size="24" font-weight="800" fill="#fff">{label}</text>
    </svg>
    """
    return f"data:image/svg+xml;utf8,{quote(svg)}"


SEED_GAMES = [
    {
        "id": "galaxy-run",
        "title": "Wyprawa przez Galaktykę",
        "category": "Strategiczne",
        "complexity": "średnia",
        "players_min": 2,
        "players_max": 4,
        "duration_minutes": 90,
        "rating": 4.8,
        "cover": cover_svg("GALAXY", "#16324f", "#5b2a86", "#f6bd60"),
        "description": "Rozbudowa floty, handel surowcami i rywalizacja o sektory mapy.",
        "tags_csv": tags_to_csv(["kosmos", "ekonomia", "mapa"]),
    },
    {
        "id": "north-castles",
        "title": "Zamki Północy",
        "category": "Euro",
        "complexity": "ekspercka",
        "players_min": 2,
        "players_max": 5,
        "duration_minutes": 120,
        "rating": 4.7,
        "cover": cover_svg("CASTLE", "#37505c", "#7a4f35", "#e9c46a"),
        "description": "Planowanie tur, zarządzanie pracownikami i budowa zimowego królestwa.",
        "tags_csv": tags_to_csv(["worker placement", "budowanie", "zasoby"]),
    },
    {
        "id": "rivals-cafe",
        "title": "Kawiarnia Rywali",
        "category": "Familijne",
        "complexity": "familijna",
        "players_min": 2,
        "players_max": 6,
        "duration_minutes": 35,
        "rating": 4.2,
        "cover": cover_svg("CAFE", "#b65f35", "#2d6a4f", "#fff3b0"),
        "description": "Szybka gra karciana o obsłudze klientów i blokowaniu przeciwników.",
        "tags_csv": tags_to_csv(["karty", "szybka", "rodzinna"]),
    },
    {
        "id": "rail-trails",
        "title": "Kolejowe Szlaki",
        "category": "Familijne",
        "complexity": "familijna",
        "players_min": 2,
        "players_max": 5,
        "duration_minutes": 45,
        "rating": 4.5,
        "cover": cover_svg("RAIL", "#264653", "#8a5a44", "#f4a261"),
        "description": "Budowanie połączeń, kompletowanie kontraktów i walka o najlepsze trasy.",
        "tags_csv": tags_to_csv(["trasy", "rodzinna", "mapa"]),
    },
]


def seed_demo_data(db: Session) -> None:
    if not db.get(User, DEMO_USER_ID):
        db.add(
            User(
                id=DEMO_USER_ID,
                name="Jan Kowalski",
                email=DEMO_EMAIL,
                role="pracownik",
                password_hash=hash_password(DEMO_PASSWORD),
                joined_at=datetime.utcnow(),
            )
        )

    for game_data in SEED_GAMES:
        if not db.get(Game, game_data["id"]):
            db.add(Game(**game_data))

    db.commit()

    active_demo = db.get(Rental, "r-demo-overdue")
    rail_game = db.get(Game, "rail-trails")
    demo_user = db.get(User, DEMO_USER_ID)

    if not active_demo and rail_game and demo_user:
        borrowed_at = datetime.utcnow() - timedelta(days=35)
        due_date = datetime.utcnow() - timedelta(days=3)
        db.add(
            Rental(
                id="r-demo-overdue",
                game_id=rail_game.id,
                game_title=rail_game.title,
                user_id=demo_user.id,
                user_name=demo_user.name,
                borrowed_at=borrowed_at,
                due_date=due_date,
            )
        )
        db.commit()
