from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserRead"


class LoginRequest(BaseModel):
    email: str
    password: str


class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "broker"
    manager_id: int | None = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserRead(UserBase, ORMModel):
    id: int
    created_at: datetime


class ProjectBase(BaseModel):
    name: str
    slug: str
    description: str = ""
    address: str = "Phu My Hung, District 7, Ho Chi Minh City"
    property_types: list[str] = []
    amenities: list[str] = []
    nearby_places: list[str] = []
    images: list[str] = []
    sort_order: int = 0
    active: bool = True


class ProjectRead(ProjectBase, ORMModel):
    id: int


class OwnerBase(BaseModel):
    full_name: str
    phone: str
    email: str | None = None
    zalo: str | None = None
    whatsapp: str | None = None
    nationality: str | None = None
    preferred_language: str = "en"
    address: str | None = None
    bank_info: str | None = None
    notes: str | None = None
    assigned_user_id: int | None = None


class OwnerRead(OwnerBase, ORMModel):
    id: int
    created_at: datetime


class PropertyImageRead(ORMModel):
    id: int
    image_url: str
    caption: str | None = None
    sort_order: int = 0
    is_cover: bool = False


class PropertyBase(BaseModel):
    code: str
    slug: str
    title: str
    listing_type: str
    property_type: str
    status: str = "available"
    project_id: int
    owner_id: int | None = None
    assigned_user_id: int | None = None
    address_detail: str | None = None
    tower_block: str | None = None
    floor: str | None = None
    unit_number: str | None = None
    bedrooms: int = 1
    bathrooms: int = 1
    area_sqm: Decimal = Decimal("0")
    rental_price: Decimal | None = None
    sale_price: Decimal | None = None
    currency: str = "VND"
    management_fee: Decimal | None = None
    deposit_amount: Decimal | None = None
    furniture_status: str = "fully_furnished"
    view_type: str | None = None
    balcony: bool = False
    pet_friendly: bool = False
    parking: bool = False
    available_from: datetime | None = None
    legal_status: str | None = None
    description_vi: str = ""
    description_en: str = ""
    internal_notes: str | None = None
    is_verified: bool = False
    is_featured: bool = False


class PropertyRead(PropertyBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: datetime
    images: list[PropertyImageRead] = []


class CustomerBase(BaseModel):
    full_name: str
    phone: str
    email: str | None = None
    zalo: str | None = None
    whatsapp: str | None = None
    nationality: str | None = None
    preferred_language: str = "en"
    customer_type: str = "tenant"
    source: str = "website"
    status: str = "new"
    assigned_user_id: int | None = None
    notes: str | None = None


class CustomerRead(CustomerBase, ORMModel):
    id: int
    created_at: datetime


class RequirementBase(BaseModel):
    customer_id: int
    listing_type: str
    property_type: str | None = None
    preferred_projects: list[int] = []
    min_bedrooms: int | None = None
    max_bedrooms: int | None = None
    min_area: Decimal | None = None
    max_area: Decimal | None = None
    min_budget: Decimal | None = None
    max_budget: Decimal | None = None
    currency: str = "VND"
    move_in_date: datetime | None = None
    furniture_required: str | None = None
    pet_friendly_required: bool = False
    balcony_required: bool = False
    parking_required: bool = False
    preferred_view: str | None = None
    lifestyle_notes: str | None = None
    priority_level: str = "medium"


class RequirementRead(RequirementBase, ORMModel):
    id: int


class ViewingBase(BaseModel):
    customer_id: int
    property_id: int
    assigned_user_id: int | None = None
    scheduled_at: datetime
    status: str = "scheduled"
    meeting_location: str | None = None
    customer_feedback: str | None = None
    broker_notes: str | None = None
    next_follow_up_at: datetime | None = None


class ViewingRead(ViewingBase, ORMModel):
    id: int


class DealBase(BaseModel):
    customer_id: int
    property_id: int
    owner_id: int | None = None
    assigned_user_id: int | None = None
    deal_type: str
    stage: str = "new"
    expected_value: Decimal | None = None
    final_value: Decimal | None = None
    commission_rate: Decimal = Decimal("1.0")
    commission_amount: Decimal | None = None
    expected_close_date: datetime | None = None
    closed_at: datetime | None = None
    lost_reason: str | None = None
    notes: str | None = None


class DealStageUpdate(BaseModel):
    stage: str
    note: str | None = None


class DealRead(DealBase, ORMModel):
    id: int


class CommissionBase(BaseModel):
    deal_id: int
    broker_id: int
    gross_commission: Decimal = Decimal("0")
    company_share: Decimal = Decimal("0")
    broker_share: Decimal = Decimal("0")
    payment_status: str = "pending"
    paid_at: datetime | None = None
    note: str | None = None


class CommissionRead(CommissionBase, ORMModel):
    id: int


class ActivityRead(ORMModel):
    id: int
    actor_user_id: int | None = None
    entity_type: str
    entity_id: int | None = None
    action: str
    note: str
    created_at: datetime


class SettingsBase(BaseModel):
    company_name: str = "Phu My Hung Homes"
    logo: str | None = None
    phone: str = "+84 28 0000 0000"
    email: str = "hello@pmhhomes.local"
    address: str = "Phu My Hung, District 7, Ho Chi Minh City"
    website: str = "https://pmhhomes.local"
    zalo: str | None = None
    whatsapp: str | None = None
    default_currency: str = "VND"
    seo_title: str = "Phu My Hung Homes CRM"
    seo_description: str = "Verified Phu My Hung rentals, sales, and broker CRM."
    metadata_json: dict[str, Any] = {}


class SettingsRead(SettingsBase, ORMModel):
    id: int


class MatchResult(BaseModel):
    property: PropertyRead
    score: int
    matched_reasons: list[str]
    missing_criteria: list[str]
    recommended_next_action: str


class DashboardSummary(BaseModel):
    total_properties: int
    available_properties: int
    active_customers: int
    viewings_this_week: int
    open_deals: int
    deals_won_this_month: int
    estimated_commission: float
    deal_pipeline: dict[str, int]
    recent_activities: list[ActivityRead]
    upcoming_appointments: list[ViewingRead]


Token.model_rebuild()
