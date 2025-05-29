from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator

from .config import settings

# engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
# We'll use a safer check for DATABASE_URL which might be None in early setup
db_url = settings.DATABASE_URL or "postgresql://jordy:jordy_pass@localhost/jordy_observe"
engine = create_engine(db_url, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
