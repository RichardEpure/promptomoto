import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.ai_models import AiModel, AiModelCreate, AiModelUpdate
from app.routers.users import AdminUser

router = APIRouter(prefix="/ai-models", tags=["ai-models"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("", response_model=AiModel)
def create_prompt(ai_model: AiModelCreate, session: SessionDep, admin_user: AdminUser):
    db_ai_model = AiModel.model_validate(ai_model)
    session.add(db_ai_model)
    session.commit()
    session.refresh(db_ai_model)
    return db_ai_model


@router.get("", response_model=list[AiModel])
def read_ai_models(session: SessionDep):
    return session.exec(select(AiModel)).all()


@router.get("/{ai_model_id}", response_model=AiModel)
def read_ai_model(ai_model_id: str, session: SessionDep):
    db_ai_model = session.get(AiModel, uuid.UUID(ai_model_id))
    if not db_ai_model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="AI model not found"
        )
    return db_ai_model


@router.delete("/{ai_model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ai_model(ai_model_id: str, session: SessionDep, admin_user: AdminUser):
    db_ai_model = session.get(AiModel, uuid.UUID(ai_model_id))
    if not db_ai_model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="AI model not found"
        )
    session.delete(db_ai_model)
    session.commit()


@router.patch("/{ai_model_id}", response_model=AiModel)
def update_ai_model(
    ai_model_id: str,
    ai_model_update: AiModelUpdate,
    session: SessionDep,
    admin_user: AdminUser,
):
    db_ai_model = session.get(AiModel, uuid.UUID(ai_model_id))
    if not db_ai_model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="AI model not found"
        )
    ai_model_data = ai_model_update.model_dump(exclude_unset=True)
    db_ai_model.sqlmodel_update(ai_model_data)
    session.add(db_ai_model)
    session.commit()
    session.refresh(db_ai_model)
    return db_ai_model
