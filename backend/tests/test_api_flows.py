from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Game, Rental, User
from app.security import hash_password
from app.utils import tags_to_csv


COVER_URL = "https://images.pexels.com/photos/8111365/pexels-photo-8111365.jpeg"


def create_staff(db: Session) -> User:
    staff = User(
        id="u-staff",
        name="Pracownik Testowy",
        email="staff@example.com",
        role="pracownik",
        password_hash=hash_password("staff123"),
    )
    db.add(staff)
    db.commit()
    return staff


def create_game(db: Session, game_id: str = "test-game") -> Game:
    game = Game(
        id=game_id,
        title="Testowa Gra",
        category="Familijne",
        complexity="familijna",
        players_min=2,
        players_max=4,
        duration_minutes=45,
        rating=4.3,
        cover=COVER_URL,
        description="Opis testowej gry planszowej do wypożyczalni.",
        tags_csv=tags_to_csv(["rodzinna", "karty"]),
    )
    db.add(game)
    db.commit()
    return game


def login(client: TestClient, email: str, password: str) -> str:
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return response.json()["token"]


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_register_login_and_me_flow(client: TestClient) -> None:
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Jan Nowak", "email": "jan@example.com", "password": "secret123"},
    )

    assert register_response.status_code == 201
    body = register_response.json()
    assert body["user"]["role"] == "klient"
    assert body["token"]

    token = login(client, "jan@example.com", "secret123")
    me_response = client.get("/api/auth/me", headers=auth_header(token))

    assert me_response.status_code == 200
    assert me_response.json()["email"] == "jan@example.com"


def test_staff_can_create_and_delete_available_game(client: TestClient, db_session: Session) -> None:
    create_staff(db_session)
    token = login(client, "staff@example.com", "staff123")
    payload = {
        "title": "Nowa Gra Testowa",
        "category": "Strategiczne",
        "complexity": "średnia",
        "playersMin": 2,
        "playersMax": 5,
        "durationMinutes": 90,
        "rating": 4.0,
        "cover": COVER_URL,
        "description": "Opis nowej gry testowej dla panelu pracownika.",
        "tags": ["strategia", "test"],
    }

    create_response = client.post("/api/games", json=payload, headers=auth_header(token))

    assert create_response.status_code == 201
    game_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/games/{game_id}", headers=auth_header(token))

    assert delete_response.status_code == 204


def test_client_cannot_create_game(client: TestClient) -> None:
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Klient Testowy", "email": "client@example.com", "password": "secret123"},
    )
    token = register_response.json()["token"]

    response = client.post(
        "/api/games",
        json={
            "title": "Gra Klienta",
            "category": "Familijne",
            "complexity": "familijna",
            "playersMin": 2,
            "playersMax": 4,
            "durationMinutes": 40,
            "rating": 4.0,
            "cover": COVER_URL,
            "description": "Opis gry, której klient nie powinien móc dodać.",
            "tags": ["test"],
        },
        headers=auth_header(token),
    )

    assert response.status_code == 403


def test_borrow_return_and_delete_conflict(client: TestClient, db_session: Session) -> None:
    create_staff(db_session)
    game = create_game(db_session)
    client_response = client.post(
        "/api/auth/register",
        json={"name": "Klient Testowy", "email": "borrower@example.com", "password": "secret123"},
    )
    client_token = client_response.json()["token"]
    staff_token = login(client, "staff@example.com", "staff123")

    borrow_response = client.post("/api/rentals", json={"gameId": game.id, "days": 14}, headers=auth_header(client_token))

    assert borrow_response.status_code == 201

    delete_response = client.delete(f"/api/games/{game.id}", headers=auth_header(staff_token))

    assert delete_response.status_code == 409
    assert "aktywnym wypożyczeniem" in delete_response.json()["detail"]

    return_response = client.post(f"/api/rentals/{game.id}/return", headers=auth_header(client_token))

    assert return_response.status_code == 200
    assert return_response.json()["returnedAt"] is not None

    second_delete_response = client.delete(f"/api/games/{game.id}", headers=auth_header(staff_token))

    assert second_delete_response.status_code == 204


def test_return_overdue_rental_calculates_penalty(client: TestClient, db_session: Session) -> None:
    user = User(
        id="u-client",
        name="Klient Testowy",
        email="client@example.com",
        role="klient",
        password_hash=hash_password("secret123"),
    )
    game = create_game(db_session, "late-game")
    rental = Rental(
        id="r-late",
        game_id=game.id,
        game_title=game.title,
        user_id=user.id,
        user_name=user.name,
        borrowed_at=datetime.utcnow() - timedelta(days=40),
        due_date=datetime.utcnow() - timedelta(days=2),
    )
    db_session.add(user)
    db_session.add(rental)
    db_session.commit()
    token = login(client, "client@example.com", "secret123")

    response = client.post(f"/api/rentals/{game.id}/return", headers=auth_header(token))

    assert response.status_code == 200
    assert response.json()["penaltyAtReturn"] == 5.0
