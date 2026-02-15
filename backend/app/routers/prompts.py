import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models.prompts import Prompt, PromptCreate, PromptUpdate
from app.models.users import UserRole
from app.routers.users import CurrentUser

router = APIRouter(prefix="/prompts", tags=["prompts"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("", response_model=Prompt)
def create_prompt(prompt: PromptCreate, session: SessionDep, current_user: CurrentUser):
    db_prompt = Prompt.model_validate(prompt)
    db_prompt.user_id = current_user.id
    session.add(db_prompt)
    session.commit()
    session.refresh(db_prompt)
    return db_prompt


@router.get("", response_model=list[Prompt])
def read_prompts(session: SessionDep):
    return session.exec(select(Prompt)).all()


@router.get("/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: str, session: SessionDep):
    prompt = session.get(Prompt, uuid.UUID(prompt_id))
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt


@router.delete("/{prompt_id}", status_code=204)
def delete_prompt(prompt_id: str, session: SessionDep, current_user: CurrentUser):
    db_prompt = session.get(Prompt, uuid.UUID(prompt_id))
    if not db_prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if current_user.role != UserRole.ADMIN and db_prompt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
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
        raise HTTPException(status_code=404, detail="Prompt not found")
    if current_user.role != UserRole.ADMIN and db_prompt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    prompt_data = prompt_update.model_dump(exclude_unset=True)
    db_prompt.sqlmodel_update(prompt_data)
    session.add(db_prompt)
    session.commit()
    session.refresh(db_prompt)
    return db_prompt
