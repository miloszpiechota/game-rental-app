from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import Game, Rental, User
from .security import hash_password
from .utils import new_id, tags_to_csv


DEMO_USER_ID = "u-demo"
DEMO_EMAIL = "demo@gralnia.pl"
DEMO_PASSWORD = "demo123"

COVER_IMAGES = {
    "galaxy": "https://images.pexels.com/photos/8111365/pexels-photo-8111365.jpeg",
    "castle": "https://images.pexels.com/photos/27219523/pexels-photo-27219523.jpeg",
    "cafe": "https://images.pexels.com/photos/7594348/pexels-photo-7594348.jpeg",
    "rail": "https://images.pexels.com/photos/9501388/pexels-photo-9501388.jpeg",
}


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
        "cover": COVER_IMAGES["galaxy"],
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
        "cover": COVER_IMAGES["castle"],
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
        "cover": COVER_IMAGES["cafe"],
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
        "cover": COVER_IMAGES["rail"],
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
        existing_game = db.get(Game, game_data["id"])
        if not existing_game:
            db.add(Game(**game_data))
        elif existing_game.cover.startswith("data:image/svg+xml"):
            existing_game.cover = game_data["cover"]

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
