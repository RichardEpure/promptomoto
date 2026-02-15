import uuid
from typing import Annotated

import jwt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from ..config import settings
from ..database import get_session
from ..models.users import User, UserCreate, UserPublic, UserRole, UserUpdate
from ..security import hash_password

router = APIRouter(prefix="/users", tags=["users"])

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="auth/token")

SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str | None, Cookie()]


def get_current_user(session: SessionDep, access_token: TokenDep = None) -> User:
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    try:
        payload = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = session.get(User, uuid.UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_admin_user(current_user: CurrentUser) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


AdminUser = Annotated[User, Depends(get_admin_user)]


@router.post("", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep):
    conflicts = session.exec(
        select(User).where(
            (User.username == user.username) | (User.email == user.email)
        )
    ).all()

    if conflicts:
        for conflict in conflicts:
            detail = {"type": "user_exists"}
            if conflict.username == user.username:
                detail["username"] = "Username already exists"
            if conflict.email == user.email:
                detail["email"] = "Email already exists"

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )

    db_user = User.model_validate(
        user, update={"hashed_password": hash_password(user.password)}
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser):
    return current_user


@router.get("", response_model=list[UserPublic])
def read_users(
    session: SessionDep,
    admin_user: AdminUser,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users


@router.get("/{user_id}", response_model=UserPublic)
def read_user(user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user


@router.patch("/{user_id}", response_model=UserPublic)
def update_user(
    user_id: uuid.UUID,
    user: UserUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    user_data = user.model_dump(exclude_unset=True)
    if "password" in user_data:
        password = user_data.pop("password")
        user_data["hashed_password"] = hash_password(password)

    # Only admins can change roles
    if "role" in user_data and current_user.role != UserRole.ADMIN:
        del user_data["role"]

    db_user.sqlmodel_update(user_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(user)
    session.commit()
