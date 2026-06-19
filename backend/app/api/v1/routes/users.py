from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_roles
from app.core.permissions import Role
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models import User
from app.schemas import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[User]:
    stmt = select(User).order_by(User.full_name)
    if current_user.role == Role.manager:
        stmt = stmt.where((User.id == current_user.id) | (User.manager_id == current_user.id))
    elif current_user.role not in {Role.admin, Role.manager}:
        stmt = stmt.where(User.id == current_user.id)
    return list(db.scalars(stmt))


@router.post("", response_model=UserRead, dependencies=[Depends(require_roles(Role.admin))])
def create_user(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    user = User(**payload.model_dump(exclude={"password"}), hashed_password=get_password_hash(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
