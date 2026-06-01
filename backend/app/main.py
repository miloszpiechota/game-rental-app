from time import sleep
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .database import Base, SessionLocal, engine
from .routers import auth, games, rentals
from .seed import seed_demo_data


settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(games.router, prefix=settings.api_prefix)
app.include_router(rentals.router, prefix=settings.api_prefix)


@app.on_event("startup")
def startup() -> None:
    last_error: Exception | None = None

    for _attempt in range(12):
        try:
            Base.metadata.create_all(bind=engine)
            last_error = None
            break
        except Exception as error:
            last_error = error
            sleep(5)

    if last_error:
        raise last_error

    if settings.seed_demo_data:
        db = SessionLocal()
        try:
            seed_demo_data(db)
        finally:
            db.close()


@app.get(f"{settings.api_prefix}/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
