import uuid
from enum import Enum

from sqlalchemy import Column, Text
from sqlmodel import JSON, Field, SQLModel


class PromptTag(str, Enum):
    IMAGE = "image"
    TEXT = "text"
    AUDIO = "audio"
    VIDEO = "video"


class PromptBase(SQLModel):
    name: str = Field(index=True, nullable=False, min_length=1, max_length=100)
    short_description: str = Field(default="", max_length=255)
    description: str = Field(default="")
    content: str = Field(default="", sa_column=Column(Text))
    tags: list[PromptTag] = Field(default_factory=list, sa_column=Column(JSON))
    ai_model_id: uuid.UUID = Field(index=True, nullable=False, foreign_key="aimodel.id")


class Prompt(PromptBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(index=True, nullable=False, foreign_key="user.id")


class PromptCreate(PromptBase):
    pass


class PromptUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    short_description: str | None = Field(default=None, max_length=255)
    description: str | None = None
    content: str | None = None
    tags: list[PromptTag] | None = None
    ai_model_id: uuid.UUID | None = None
