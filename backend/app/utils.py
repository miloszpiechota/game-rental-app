from datetime import datetime, timedelta
from typing import Iterable
from uuid import uuid4


DAILY_PENALTY_PLN = 2.5


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex}"


def csv_to_tags(tags_csv: str) -> list[str]:
    return [tag for tag in tags_csv.split(",") if tag]


def tags_to_csv(tags: Iterable[str]) -> str:
    return ",".join(tag.strip() for tag in tags if tag.strip())


def due_date_from_now(days: int) -> datetime:
    due_date = datetime.utcnow() + timedelta(days=days)
    return due_date.replace(hour=23, minute=59, second=59, microsecond=999000)


def calculate_penalty(due_date: datetime, now: datetime | None = None) -> float:
    current = now or datetime.utcnow()
    overdue_days = max(0, (current.date() - due_date.date()).days)
    return overdue_days * DAILY_PENALTY_PLN
