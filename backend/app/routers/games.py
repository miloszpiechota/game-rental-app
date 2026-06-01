from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from slugify import slugify
from ..database import get_db
from ..models import Favorite, Game, Rental, User
from ..schemas import FavoriteIdsResponse, GameCreate, GameRead
from ..security import get_current_user, require_staff
from ..serializers import serialize_game
from ..utils import tags_to_csv


router = APIRouter(prefix="/games", tags=["games"])


def get_active_rental_map(db: Session) -> dict[str, Rental]:
    rentals = db.scalars(select(Rental).where(Rental.returned_at.is_(None))).all()
    return {rental.game_id: rental for rental in rentals}


@router.get("", response_model=list[GameRead])
def list_games(db: Session = Depends(get_db)) -> list[dict]:
    games = db.scalars(select(Game).where(Game.deleted.is_(False)).order_by(Game.rating.desc())).all()
    active_rentals = get_active_rental_map(db)
    return [serialize_game(game, active_rentals.get(game.id)) for game in games]


@router.post("", response_model=GameRead, status_code=status.HTTP_201_CREATED)
def create_game(
    payload: GameCreate,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
) -> dict:
    base_id = slugify(payload.title) or "game"
    game_id = base_id
    suffix = 1

    while db.get(Game, game_id):
        suffix += 1
        game_id = f"{base_id}-{suffix}"

    game = Game(
        id=game_id,
        title=payload.title.strip(),
        category=payload.category.strip(),
        complexity=payload.complexity,
        players_min=payload.playersMin,
        players_max=payload.playersMax,
        duration_minutes=payload.durationMinutes,
        rating=payload.rating,
        cover=payload.cover,
        description=payload.description.strip(),
        tags_csv=tags_to_csv(payload.tags),
    )
    db.add(game)
    db.commit()
    db.refresh(game)

    return serialize_game(game)


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_game(
    game_id: str,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
) -> None:
    game = db.get(Game, game_id)

    if not game or game.deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gra nie istnieje.")

    active_rental = db.scalar(select(Rental).where(Rental.game_id == game_id, Rental.returned_at.is_(None)))

    if active_rental:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Nie można usunąć gry z aktywnym wypożyczeniem. Najpierw gra musi zostać zwrócona.",
        )

    db.query(Favorite).filter(Favorite.game_id == game_id).delete()
    game.deleted = True
    db.commit()


@router.get("/favorites", response_model=FavoriteIdsResponse)
def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    ids = db.scalars(select(Favorite.game_id).where(Favorite.user_id == current_user.id)).all()
    return {"favoriteIds": list(ids)}


@router.post("/{game_id}/favorite", response_model=FavoriteIdsResponse)
def add_favorite(game_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    game = db.get(Game, game_id)

    if not game or game.deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gra nie istnieje.")

    existing = db.scalar(select(Favorite).where(Favorite.user_id == current_user.id, Favorite.game_id == game_id))

    if not existing:
        db.add(Favorite(user_id=current_user.id, game_id=game_id))
        db.commit()

    ids = db.scalars(select(Favorite.game_id).where(Favorite.user_id == current_user.id)).all()
    return {"favoriteIds": list(ids)}


@router.delete("/{game_id}/favorite", response_model=FavoriteIdsResponse)
def remove_favorite(game_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.game_id == game_id).delete()
    db.commit()
    ids = db.scalars(select(Favorite.game_id).where(Favorite.user_id == current_user.id)).all()
    return {"favoriteIds": list(ids)}
