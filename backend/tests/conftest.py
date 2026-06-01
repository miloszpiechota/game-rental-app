import os
import sys
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./test_gralnia.db"
os.environ["API_SECRET_KEY"] = "test-secret"
os.environ["SEED_DEMO_DATA"] = "false"
os.environ["CORS_ORIGINS"] = "http://testserver"

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.main import app


@pytest.fixture()
def db_session() -> Session:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
