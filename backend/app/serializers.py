from .models import Game, Rental, User
from .utils import csv_to_tags


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "joinedAt": user.joined_at,
    }


def serialize_game(game: Game, active_rental: Rental | None = None) -> dict:
    return {
        "id": game.id,
        "title": game.title,
        "category": game.category,
        "complexity": game.complexity,
        "playersMin": game.players_min,
        "playersMax": game.players_max,
        "durationMinutes": game.duration_minutes,
        "rating": game.rating,
        "cover": game.cover,
        "description": game.description,
        "tags": csv_to_tags(game.tags_csv),
        "borrowedBy": active_rental.user_id if active_rental else None,
        "borrowedAt": active_rental.borrowed_at if active_rental else None,
        "dueDate": active_rental.due_date if active_rental else None,
    }


def serialize_rental(rental: Rental) -> dict:
    return {
        "id": rental.id,
        "gameId": rental.game_id,
        "gameTitle": rental.game_title,
        "userId": rental.user_id,
        "userName": rental.user_name,
        "borrowedAt": rental.borrowed_at,
        "dueDate": rental.due_date,
        "returnedAt": rental.returned_at,
        "penaltyAtReturn": rental.penalty_at_return,
    }
