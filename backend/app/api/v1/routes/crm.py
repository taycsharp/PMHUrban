from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TypeVar

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.api.v1.deps import get_current_user, require_roles, require_write, team_member_ids
from app.core.permissions import Role, can_view_assigned
from app.db.session import get_db
from app.models import (
    Activity,
    Commission,
    CompanySettings,
    Customer,
    CustomerRequirement,
    Deal,
    Owner,
    Project,
    Property,
    ViewingAppointment,
)
from app.schemas import (
    ActivityRead,
    CommissionBase,
    CommissionRead,
    CustomerBase,
    CustomerRead,
    DashboardSummary,
    DealBase,
    DealRead,
    DealStageUpdate,
    MatchResult,
    OwnerBase,
    OwnerRead,
    ProjectBase,
    ProjectRead,
    PropertyBase,
    PropertyRead,
    RequirementBase,
    RequirementRead,
    SettingsBase,
    SettingsRead,
    ViewingBase,
    ViewingRead,
)
from app.services.matching import score_property

ModelT = TypeVar("ModelT")


def _visible_stmt(stmt, model, db: Session, current_user):
    if current_user.role == Role.admin:
        return stmt
    team_ids = team_member_ids(db, current_user)
    if hasattr(model, "assigned_user_id"):
        if current_user.role == Role.manager:
            return stmt.where(model.assigned_user_id.in_([current_user.id, *team_ids]))
        return stmt.where((model.assigned_user_id == current_user.id) | (model.assigned_user_id.is_(None)))
    return stmt


def _get_visible_or_404(model: type[ModelT], item_id: int, db: Session, current_user) -> ModelT:
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    assigned = getattr(item, "assigned_user_id", None)
    if hasattr(item, "assigned_user_id") and not can_view_assigned(
        current_user.role, current_user.id, assigned, team_member_ids(db, current_user)
    ):
        raise HTTPException(status_code=403, detail="Insufficient permission")
    return item


def _log(db: Session, user_id: int | None, entity_type: str, entity_id: int | None, action: str, note: str = "") -> None:
    db.add(Activity(actor_user_id=user_id, entity_type=entity_type, entity_id=entity_id, action=action, note=note))


projects_router = APIRouter(prefix="/projects", tags=["projects"])
properties_router = APIRouter(prefix="/properties", tags=["properties"])
owners_router = APIRouter(prefix="/owners", tags=["owners"])
customers_router = APIRouter(prefix="/customers", tags=["customers"])
requirements_router = APIRouter(prefix="/requirements", tags=["requirements"])
matching_router = APIRouter(prefix="/matching", tags=["matching"])
viewings_router = APIRouter(prefix="/viewings", tags=["viewings"])
deals_router = APIRouter(prefix="/deals", tags=["deals"])
commissions_router = APIRouter(prefix="/commissions", tags=["commissions"])
activities_router = APIRouter(prefix="/activities", tags=["activities"])
settings_router = APIRouter(prefix="/settings", tags=["settings"])
dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"])
public_router = APIRouter(prefix="/public", tags=["public"])


@projects_router.get("", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list(db.scalars(select(Project).order_by(Project.sort_order, Project.name)))


@projects_router.post("", response_model=ProjectRead, dependencies=[Depends(require_write)])
def create_project(payload: ProjectBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    _log(db, current_user.id, "project", project.id, "project created", f"Created Phu My Hung project {project.name}")
    db.commit()
    return project


@owners_router.get("", response_model=list[OwnerRead])
def list_owners(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = _visible_stmt(select(Owner).order_by(Owner.full_name), Owner, db, current_user)
    return list(db.scalars(stmt))


@owners_router.post("", response_model=OwnerRead, dependencies=[Depends(require_write)])
def create_owner(payload: OwnerBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    owner = Owner(**payload.model_dump())
    db.add(owner)
    db.commit()
    db.refresh(owner)
    _log(db, current_user.id, "owner", owner.id, "owner created", "Created Phu My Hung owner profile")
    db.commit()
    return owner


@owners_router.get("/{owner_id}", response_model=OwnerRead)
def get_owner(owner_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return _get_visible_or_404(Owner, owner_id, db, current_user)


@customers_router.get("", response_model=list[CustomerRead])
def list_customers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = _visible_stmt(select(Customer).order_by(Customer.created_at.desc()), Customer, db, current_user)
    return list(db.scalars(stmt))


@customers_router.post("", response_model=CustomerRead, dependencies=[Depends(require_write)])
def create_customer(payload: CustomerBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    _log(db, current_user.id, "customer", customer.id, "customer created", "Created Phu My Hung customer lead")
    db.commit()
    return customer


@customers_router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(customer_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return _get_visible_or_404(Customer, customer_id, db, current_user)


@requirements_router.get("", response_model=list[RequirementRead])
def list_requirements(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = select(CustomerRequirement).join(Customer).order_by(CustomerRequirement.created_at.desc())
    if current_user.role != Role.admin:
        visible_customer_ids = [c.id for c in db.scalars(_visible_stmt(select(Customer), Customer, db, current_user))]
        stmt = stmt.where(CustomerRequirement.customer_id.in_(visible_customer_ids))
    return list(db.scalars(stmt))


@requirements_router.post("", response_model=RequirementRead, dependencies=[Depends(require_write)])
def create_requirement(payload: RequirementBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    _get_visible_or_404(Customer, payload.customer_id, db, current_user)
    requirement = CustomerRequirement(**payload.model_dump())
    db.add(requirement)
    db.commit()
    db.refresh(requirement)
    _log(db, current_user.id, "requirement", requirement.id, "customer requirement created", "Added Phu My Hung search criteria")
    db.commit()
    return requirement


@properties_router.get("", response_model=list[PropertyRead])
def list_properties(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = select(Property).options(selectinload(Property.images)).where(Property.deleted_at.is_(None)).order_by(Property.created_at.desc())
    return list(db.scalars(_visible_stmt(stmt, Property, db, current_user)))


@properties_router.post("", response_model=PropertyRead, dependencies=[Depends(require_write)])
def create_property(payload: PropertyBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    property_ = Property(**payload.model_dump())
    db.add(property_)
    db.commit()
    db.refresh(property_)
    _log(db, current_user.id, "property", property_.id, "property created", f"Created {property_.code} in Phu My Hung")
    db.commit()
    return property_


@properties_router.get("/{property_id}", response_model=PropertyRead)
def get_property(property_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = _get_visible_or_404(Property, property_id, db, current_user)
    return item


@properties_router.put("/{property_id}", response_model=PropertyRead, dependencies=[Depends(require_write)])
def update_property(property_id: int, payload: PropertyBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = _get_visible_or_404(Property, property_id, db, current_user)
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    _log(db, current_user.id, "property", item.id, "property updated", f"Updated {item.code}")
    db.commit()
    db.refresh(item)
    return item


@properties_router.delete("/{property_id}", dependencies=[Depends(require_write)])
def delete_property(property_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = _get_visible_or_404(Property, property_id, db, current_user)
    item.deleted_at = datetime.now(timezone.utc)
    item.status = "inactive"
    _log(db, current_user.id, "property", item.id, "property status changed", f"Soft deleted {item.code}")
    db.commit()
    return {"ok": True}


@matching_router.get("/{customer_id}", response_model=list[MatchResult])
def match_customer(customer_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    customer = _get_visible_or_404(Customer, customer_id, db, current_user)
    requirement = db.scalar(select(CustomerRequirement).where(CustomerRequirement.customer_id == customer.id).order_by(CustomerRequirement.created_at.desc()))
    if not requirement:
        raise HTTPException(status_code=404, detail="Customer has no requirement")
    properties = db.scalars(
        select(Property).options(selectinload(Property.images)).where(Property.status == "available", Property.deleted_at.is_(None), Property.is_verified.is_(True))
    )
    matches = [score_property(requirement, property_) for property_ in properties]
    return sorted(matches, key=lambda result: result["score"], reverse=True)[:10]


@viewings_router.get("", response_model=list[ViewingRead])
def list_viewings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = _visible_stmt(select(ViewingAppointment).order_by(ViewingAppointment.scheduled_at), ViewingAppointment, db, current_user)
    return list(db.scalars(stmt))


@viewings_router.post("", response_model=ViewingRead, dependencies=[Depends(require_write)])
def create_viewing(payload: ViewingBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    viewing = ViewingAppointment(**payload.model_dump())
    db.add(viewing)
    db.commit()
    db.refresh(viewing)
    _log(db, current_user.id, "viewing", viewing.id, "appointment scheduled", "Scheduled Phu My Hung viewing appointment")
    db.commit()
    return viewing


@deals_router.get("", response_model=list[DealRead])
def list_deals(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = _visible_stmt(select(Deal).order_by(Deal.created_at.desc()), Deal, db, current_user)
    return list(db.scalars(stmt))


@deals_router.post("", response_model=DealRead, dependencies=[Depends(require_write)])
def create_deal(payload: DealBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    deal = Deal(**payload.model_dump())
    db.add(deal)
    db.commit()
    db.refresh(deal)
    _log(db, current_user.id, "deal", deal.id, "deal created", "Created Phu My Hung deal")
    db.commit()
    return deal


@deals_router.get("/{deal_id}", response_model=DealRead)
def get_deal(deal_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return _get_visible_or_404(Deal, deal_id, db, current_user)


@deals_router.patch("/{deal_id}/stage", response_model=DealRead, dependencies=[Depends(require_write)])
def update_deal_stage(deal_id: int, payload: DealStageUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    deal = _get_visible_or_404(Deal, deal_id, db, current_user)
    deal.stage = payload.stage
    if payload.stage == "closed_won":
        deal.closed_at = datetime.now(timezone.utc)
    _log(db, current_user.id, "deal", deal.id, "deal stage changed", payload.note or f"Stage changed to {payload.stage}")
    db.commit()
    db.refresh(deal)
    return deal


@commissions_router.get("", response_model=list[CommissionRead])
def list_commissions(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = select(Commission).order_by(Commission.created_at.desc())
    if current_user.role == Role.broker:
        stmt = stmt.where(Commission.broker_id == current_user.id)
    return list(db.scalars(stmt))


@commissions_router.post("", response_model=CommissionRead, dependencies=[Depends(require_roles(Role.admin, Role.manager))])
def create_commission(payload: CommissionBase, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    commission = Commission(**payload.model_dump())
    db.add(commission)
    db.commit()
    db.refresh(commission)
    _log(db, current_user.id, "commission", commission.id, "commission updated", "Created Phu My Hung commission record")
    db.commit()
    return commission


@activities_router.get("", response_model=list[ActivityRead])
def list_activities(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list(db.scalars(select(Activity).order_by(Activity.created_at.desc()).limit(100)))


@settings_router.get("", response_model=SettingsRead)
def get_settings_record(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    settings = db.scalar(select(CompanySettings))
    if not settings:
        settings = CompanySettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@settings_router.put("", response_model=SettingsRead, dependencies=[Depends(require_roles(Role.admin))])
def update_settings(payload: SettingsBase, db: Session = Depends(get_db)):
    settings = db.scalar(select(CompanySettings)) or CompanySettings()
    for key, value in payload.model_dump().items():
        setattr(settings, key, value)
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings


@dashboard_router.get("", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    week_end = now + timedelta(days=7)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_properties = db.scalar(select(func.count(Property.id)).where(Property.deleted_at.is_(None))) or 0
    available_properties = db.scalar(select(func.count(Property.id)).where(Property.status == "available", Property.deleted_at.is_(None))) or 0
    active_customers = db.scalar(select(func.count(Customer.id)).where(Customer.status.notin_(["closed", "lost"]))) or 0
    viewings_this_week = db.scalar(
        select(func.count(ViewingAppointment.id)).where(ViewingAppointment.scheduled_at >= now, ViewingAppointment.scheduled_at <= week_end)
    ) or 0
    open_deals = db.scalar(select(func.count(Deal.id)).where(Deal.stage.notin_(["closed_won", "closed_lost"]))) or 0
    deals_won_this_month = db.scalar(select(func.count(Deal.id)).where(Deal.stage == "closed_won", Deal.closed_at >= month_start)) or 0
    estimated_commission = float(db.scalar(select(func.coalesce(func.sum(Deal.commission_amount), 0)).where(Deal.stage.notin_(["closed_lost"]))) or 0)
    pipeline_rows = db.execute(select(Deal.stage, func.count(Deal.id)).group_by(Deal.stage)).all()
    recent_activities = list(db.scalars(select(Activity).order_by(Activity.created_at.desc()).limit(8)))
    upcoming = list(db.scalars(select(ViewingAppointment).where(ViewingAppointment.scheduled_at >= now).order_by(ViewingAppointment.scheduled_at).limit(8)))
    return DashboardSummary(
        total_properties=total_properties,
        available_properties=available_properties,
        active_customers=active_customers,
        viewings_this_week=viewings_this_week,
        open_deals=open_deals,
        deals_won_this_month=deals_won_this_month,
        estimated_commission=estimated_commission,
        deal_pipeline={stage: count for stage, count in pipeline_rows},
        recent_activities=recent_activities,
        upcoming_appointments=upcoming,
    )


@public_router.get("/properties", response_model=list[PropertyRead])
def public_properties(
    listing_type: str | None = None,
    property_type: str | None = None,
    project_id: int | None = None,
    q: str | None = None,
    bedrooms: int | None = None,
    bathrooms: int | None = None,
    min_area: float | None = None,
    max_area: float | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    furniture_status: str | None = None,
    view_type: str | None = None,
    pet_friendly: bool | None = None,
    balcony: bool | None = None,
    parking: bool | None = None,
    verified_only: bool = True,
    db: Session = Depends(get_db),
):
    stmt = select(Property).options(selectinload(Property.images)).where(Property.status == "available", Property.deleted_at.is_(None))
    if listing_type:
        stmt = stmt.where(Property.listing_type == listing_type)
    if property_type:
        stmt = stmt.where(Property.property_type == property_type)
    if project_id:
        stmt = stmt.where(Property.project_id == project_id)
    if bedrooms:
        stmt = stmt.where(Property.bedrooms >= bedrooms)
    if bathrooms:
        stmt = stmt.where(Property.bathrooms >= bathrooms)
    if min_area:
        stmt = stmt.where(Property.area_sqm >= min_area)
    if max_area:
        stmt = stmt.where(Property.area_sqm <= max_area)
    if furniture_status:
        stmt = stmt.where(Property.furniture_status == furniture_status)
    if view_type:
        stmt = stmt.where(Property.view_type == view_type)
    if pet_friendly is not None:
        stmt = stmt.where(Property.pet_friendly.is_(pet_friendly))
    if balcony is not None:
        stmt = stmt.where(Property.balcony.is_(balcony))
    if parking is not None:
        stmt = stmt.where(Property.parking.is_(parking))
    if q:
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Property.code.ilike(pattern),
                Property.title.ilike(pattern),
                Property.address_detail.ilike(pattern),
                Property.tower_block.ilike(pattern),
            )
        )
    if min_price or max_price:
        price_column = Property.sale_price if listing_type == "sale" else Property.rental_price
        if min_price:
            stmt = stmt.where(price_column >= min_price)
        if max_price:
            stmt = stmt.where(price_column <= max_price)
    if verified_only:
        stmt = stmt.where(Property.is_verified.is_(True))
    return list(db.scalars(stmt.order_by(Property.is_featured.desc(), Property.created_at.desc()).limit(60)))


@public_router.get("/properties/{slug}", response_model=PropertyRead)
def public_property_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(
        select(Property).options(selectinload(Property.images)).where(Property.slug == slug, Property.status == "available", Property.deleted_at.is_(None))
    )
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@public_router.get("/projects", response_model=list[ProjectRead])
def public_projects(db: Session = Depends(get_db)):
    return list(db.scalars(select(Project).where(Project.active.is_(True)).order_by(Project.sort_order, Project.name)))


@public_router.get("/projects/{slug}", response_model=ProjectRead)
def public_project_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Project).where(Project.slug == slug, Project.active.is_(True)))
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item
