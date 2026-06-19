from __future__ import annotations

from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.permissions import Role, can_write
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    user = db.scalar(select(User).where(User.id == int(payload["sub"]), User.is_active.is_(True)))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive or missing user")
    return user


def require_roles(*roles: Role) -> Callable:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if Role(current_user.role) not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permission")
        return current_user

    return dependency


def require_write(current_user: User = Depends(get_current_user)) -> User:
    if not can_write(current_user.role):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Viewer role is read-only")
    return current_user


def team_member_ids(db: Session, current_user: User) -> set[int]:
    if current_user.role != Role.manager:
        return set()
    rows = db.scalars(select(User.id).where(User.manager_id == current_user.id)).all()
    return set(rows)
