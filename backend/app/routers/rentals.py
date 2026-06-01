from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Game, Rental, User
from ..schemas import BorrowRequest, RentalRead
from ..security import get_current_user
from ..serializers import serialize_rental
from ..utils import calculate_penalty, due_date_from_now, new_id


router = APIRouter(prefix="/rentals", tags=["rentals"])


@router.get("/me", response_model=list[RentalRead])
def my_rentals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    rentals = db.scalars(
        select(Rental).where(Rental.user_id == current_user.id).order_by(Rental.borrowed_at.desc())
    ).all()
    return [serialize_rental(rental) for rental in rentals]


@router.post("", response_model=RentalRead, status_code=status.HTTP_201_CREATED)
def borrow_game(
    payload: BorrowRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    game = db.get(Game, payload.gameId)

    if not game or game.deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gra nie istnieje.")

    active_rental = db.scalar(select(Rental).where(Rental.game_id == game.id, Rental.returned_at.is_(None)))

    if active_rental:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Gra jest już wypożyczona.")

    rental = Rental(
        id=new_id("r"),
        game_id=game.id,
        game_title=game.title,
        user_id=current_user.id,
        user_name=current_user.name,
        borrowed_at=datetime.utcnow(),
        due_date=due_date_from_now(payload.days),
    )
    db.add(rental)
    db.commit()
    db.refresh(rental)

    return serialize_rental(rental)


@router.post("/{game_id}/return", response_model=RentalRead)
def return_game(
    game_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    rental = db.scalar(
        select(Rental).where(
            Rental.game_id == game_id,
            Rental.user_id == current_user.id,
            Rental.returned_at.is_(None),
        )
    )

    if not rental:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono aktywnego wypożyczenia.")

    returned_at = datetime.utcnow()
    rental.returned_at = returned_at
    rental.penalty_at_return = calculate_penalty(rental.due_date, returned_at)
    db.commit()
    db.refresh(rental)

    return serialize_rental(rental)
