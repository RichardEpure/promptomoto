import uuid
from datetime import datetime, timezone
from enum import Enum

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


def get_current_time():
    return datetime.now(timezone.utc)


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class UserBase(SQLModel):
    username: str = Field(unique=True, index=True, min_length=3, max_length=50)
    email: EmailStr = Field(unique=True, index=True)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(nullable=False)
    role: UserRole = Field(default=UserRole.USER)
    created_at: datetime = Field(default_factory=get_current_time)


class UserPublic(UserBase):
    id: uuid.UUID
    role: UserRole
    created_at: datetime


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserUpdate(SQLModel):
    username: str | None = Field(default=None, min_length=3, max_length=50)
    email: EmailStr | None = Field(default=None)
    password: str | None = Field(default=None, min_length=8)
    role: UserRole | None = None
