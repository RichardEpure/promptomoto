import uuid

from sqlmodel import Field, SQLModel


class AiModelBase(SQLModel):
    name: str = Field(index=True, min_length=1, max_length=100)
    provider: str = Field(index=True, max_length=100)


class AiModel(AiModelBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class AiModelCreate(AiModelBase):
    pass


class AiModelUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    provider: str | None = Field(default=None, index=True, max_length=100)
