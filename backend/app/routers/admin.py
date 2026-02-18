from fastapi import APIRouter, Header, HTTPException, status
from sqlmodel import SQLModel

from app.config import settings
from app.database import create_db_and_tables, engine
from populate_db import populate

router = APIRouter(prefix="/admin", tags=["admin"])


def verify_api_key(authorization: str = Header()) -> None:
    if not settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin API key not configured"
        )

    scheme, _, key = authorization.partition(" ")
    if scheme.lower() != "bearer" or key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API key"
        )


@router.post("/reset-db", status_code=status.HTTP_204_NO_CONTENT)
def reset_db(authorization: str = Header()):
    verify_api_key(authorization)

    SQLModel.metadata.drop_all(engine)
    create_db_and_tables()
    populate()
