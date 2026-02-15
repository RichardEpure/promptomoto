from typing import Generic, TypeVar

from sqlmodel import SQLModel

T = TypeVar("T")


class PaginatedResponse(SQLModel, Generic[T]):
    items: list[T]
    total: int
