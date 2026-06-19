from __future__ import annotations

from enum import Enum


class Role(str, Enum):
    admin = "admin"
    manager = "manager"
    broker = "broker"
    viewer = "viewer"


WRITE_ROLES = {Role.admin, Role.manager, Role.broker}


def can_write(role: str) -> bool:
    return Role(role) in WRITE_ROLES


def is_read_only(role: str) -> bool:
    return Role(role) == Role.viewer


def can_view_assigned(role: str, current_user_id: int, assigned_user_id: int | None, team_member_ids: set[int]) -> bool:
    if role == Role.admin:
        return True
    if role == Role.manager:
        return assigned_user_id == current_user_id or assigned_user_id in team_member_ids
    if role in {Role.broker, Role.viewer}:
        return assigned_user_id in {None, current_user_id}
    return False
