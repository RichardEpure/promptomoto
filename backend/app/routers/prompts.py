import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, col, func, select

from app.database import get_session
from app.models.common import PaginatedResponse
from app.models.prompts import Prompt, PromptCreate, PromptUpdate
from app.models.users import UserRole
from app.routers.users import CurrentUser

router = APIRouter(prefix="/prompts", tags=["prompts"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("", response_model=Prompt)
def create_prompt(prompt: PromptCreate, session: SessionDep, current_user: CurrentUser):
    db_prompt = Prompt.model_validate(prompt, update={"user_id": current_user.id})
    session.add(db_prompt)
    session.commit()
    session.refresh(db_prompt)
    return db_prompt


@router.get("", response_model=PaginatedResponse[Prompt])
def read_prompts(
    session: SessionDep,
    offset: int = 0,
    limit: int = 100,
    search: str | None = None,
    user_id: str | None = None,
):
    query = select(Prompt)
    if search:
        query = query.where(col(Prompt.name).contains(search))
    if user_id:
        query = query.where(Prompt.user_id == uuid.UUID(user_id))

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total: int = session.exec(count_query).one()

    # Get items sliced by offset and limit
    items = session.exec(query.offset(offset).limit(limit)).all()
    return PaginatedResponse[Prompt](items=items, total=total)


@router.get("/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: str, session: SessionDep):
    prompt = session.get(Prompt, uuid.UUID(prompt_id))
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found"
        )
    return prompt


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt(prompt_id: str, session: SessionDep, current_user: CurrentUser):
    db_prompt = session.get(Prompt, uuid.UUID(prompt_id))
    if not db_prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found"
        )
    if current_user.role != UserRole.ADMIN and db_prompt.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    session.delete(db_prompt)
    session.commit()


@router.patch("/{prompt_id}", response_model=Prompt)
def update_prompt(
    prompt_id: str,
    prompt_update: PromptUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    db_prompt = session.get(Prompt, uuid.UUID(prompt_id))
    if not db_prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found"
        )
    if current_user.role != UserRole.ADMIN and db_prompt.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    prompt_data = prompt_update.model_dump(exclude_unset=True)
    db_prompt.sqlmodel_update(prompt_data)
    session.add(db_prompt)
    session.commit()
    session.refresh(db_prompt)
    return db_prompt
