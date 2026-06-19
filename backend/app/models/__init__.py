from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db.session import Base


def json_variant():
    return JSON().with_variant(JSONB, "postgresql")


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(32), index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    manager_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    manager: Mapped["User | None"] = relationship(remote_side=[id], backref="team_members")


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    address: Mapped[str] = mapped_column(String(255), default="Phu My Hung, District 7, Ho Chi Minh City")
    property_types: Mapped[list[str]] = mapped_column(MutableList.as_mutable(json_variant()), default=list)
    amenities: Mapped[list[str]] = mapped_column(MutableList.as_mutable(json_variant()), default=list)
    nearby_places: Mapped[list[str]] = mapped_column(MutableList.as_mutable(json_variant()), default=list)
    images: Mapped[list[str]] = mapped_column(MutableList.as_mutable(json_variant()), default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Owner(Base, TimestampMixin):
    __tablename__ = "owners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(64), index=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    zalo: Mapped[str | None] = mapped_column(String(64), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String(64), nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(100), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(32), default="en")
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    assigned_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    assigned_user: Mapped[User | None] = relationship()


class Property(Base, TimestampMixin):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    listing_type: Mapped[str] = mapped_column(String(16), index=True)
    property_type: Mapped[str] = mapped_column(String(32), index=True)
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("owners.id"), nullable=True)
    assigned_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    address_detail: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tower_block: Mapped[str | None] = mapped_column(String(64), nullable=True)
    floor: Mapped[str | None] = mapped_column(String(32), nullable=True)
    unit_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    bedrooms: Mapped[int] = mapped_column(Integer, default=1)
    bathrooms: Mapped[int] = mapped_column(Integer, default=1)
    area_sqm: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    rental_price: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    sale_price: Mapped[Decimal | None] = mapped_column(Numeric(16, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="VND")
    management_fee: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    deposit_amount: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    furniture_status: Mapped[str] = mapped_column(String(32), default="fully_furnished")
    view_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    balcony: Mapped[bool] = mapped_column(Boolean, default=False)
    pet_friendly: Mapped[bool] = mapped_column(Boolean, default=False)
    parking: Mapped[bool] = mapped_column(Boolean, default=False)
    available_from: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    legal_status: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description_vi: Mapped[str] = mapped_column(Text, default="")
    description_en: Mapped[str] = mapped_column(Text, default="")
    internal_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped[Project] = relationship()
    owner: Mapped[Owner | None] = relationship()
    assigned_user: Mapped[User | None] = relationship()
    images: Mapped[list["PropertyImage"]] = relationship(cascade="all, delete-orphan", back_populates="property")


class PropertyImage(Base):
    __tablename__ = "property_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id", ondelete="CASCADE"))
    image_url: Mapped[str] = mapped_column(String(500))
    caption: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_cover: Mapped[bool] = mapped_column(Boolean, default=False)

    property: Mapped[Property] = relationship(back_populates="images")


class PropertyDocument(Base, TimestampMixin):
    __tablename__ = "property_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id", ondelete="CASCADE"))
    document_type: Mapped[str] = mapped_column(String(64))
    file_url: Mapped[str] = mapped_column(String(500))
    note: Mapped[str | None] = mapped_column(Text, nullable=True)


class Customer(Base, TimestampMixin):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(64), index=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    zalo: Mapped[str | None] = mapped_column(String(64), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String(64), nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(100), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(32), default="en")
    customer_type: Mapped[str] = mapped_column(String(32), default="tenant")
    source: Mapped[str] = mapped_column(String(32), default="website")
    status: Mapped[str] = mapped_column(String(32), default="new", index=True)
    assigned_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    assigned_user: Mapped[User | None] = relationship()
    requirements: Mapped[list["CustomerRequirement"]] = relationship(cascade="all, delete-orphan", back_populates="customer")


class CustomerRequirement(Base, TimestampMixin):
    __tablename__ = "customer_requirements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"))
    listing_type: Mapped[str] = mapped_column(String(16))
    property_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    preferred_projects: Mapped[list[int]] = mapped_column(MutableList.as_mutable(json_variant()), default=list)
    min_bedrooms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_bedrooms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    min_area: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    max_area: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    min_budget: Mapped[Decimal | None] = mapped_column(Numeric(16, 2), nullable=True)
    max_budget: Mapped[Decimal | None] = mapped_column(Numeric(16, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="VND")
    move_in_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    furniture_required: Mapped[str | None] = mapped_column(String(32), nullable=True)
    pet_friendly_required: Mapped[bool] = mapped_column(Boolean, default=False)
    balcony_required: Mapped[bool] = mapped_column(Boolean, default=False)
    parking_required: Mapped[bool] = mapped_column(Boolean, default=False)
    preferred_view: Mapped[str | None] = mapped_column(String(32), nullable=True)
    lifestyle_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    priority_level: Mapped[str] = mapped_column(String(32), default="medium")

    customer: Mapped[Customer] = relationship(back_populates="requirements")


class ViewingAppointment(Base, TimestampMixin):
    __tablename__ = "viewing_appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"))
    assigned_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    status: Mapped[str] = mapped_column(String(32), default="scheduled")
    meeting_location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    customer_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    broker_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    next_follow_up_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Deal(Base, TimestampMixin):
    __tablename__ = "deals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"))
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("owners.id"), nullable=True)
    assigned_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    deal_type: Mapped[str] = mapped_column(String(16))
    stage: Mapped[str] = mapped_column(String(32), default="new", index=True)
    expected_value: Mapped[Decimal | None] = mapped_column(Numeric(16, 2), nullable=True)
    final_value: Mapped[Decimal | None] = mapped_column(Numeric(16, 2), nullable=True)
    commission_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=1.0)
    commission_amount: Mapped[Decimal | None] = mapped_column(Numeric(16, 2), nullable=True)
    expected_close_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    lost_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class Commission(Base, TimestampMixin):
    __tablename__ = "commissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    deal_id: Mapped[int] = mapped_column(ForeignKey("deals.id"))
    broker_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    gross_commission: Mapped[Decimal] = mapped_column(Numeric(16, 2), default=0)
    company_share: Mapped[Decimal] = mapped_column(Numeric(16, 2), default=0)
    broker_share: Mapped[Decimal] = mapped_column(Numeric(16, 2), default=0)
    payment_status: Mapped[str] = mapped_column(String(32), default="pending")
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)


class Activity(Base, TimestampMixin):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    entity_type: Mapped[str] = mapped_column(String(64), index=True)
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    action: Mapped[str] = mapped_column(String(64), index=True)
    note: Mapped[str] = mapped_column(Text, default="")


class CompanySettings(Base, TimestampMixin):
    __tablename__ = "company_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    company_name: Mapped[str] = mapped_column(String(255), default="Phu My Hung Homes")
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    phone: Mapped[str] = mapped_column(String(64), default="+84 28 0000 0000")
    email: Mapped[str] = mapped_column(String(255), default="hello@pmhhomes.local")
    address: Mapped[str] = mapped_column(String(255), default="Phu My Hung, District 7, Ho Chi Minh City")
    website: Mapped[str] = mapped_column(String(255), default="https://pmhhomes.local")
    zalo: Mapped[str | None] = mapped_column(String(64), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String(64), nullable=True)
    default_currency: Mapped[str] = mapped_column(String(8), default="VND")
    seo_title: Mapped[str] = mapped_column(String(255), default="Phu My Hung Homes CRM")
    seo_description: Mapped[str] = mapped_column(Text, default="Verified Phu My Hung rentals, sales, and broker CRM.")
    metadata_json: Mapped[dict] = mapped_column("metadata", json_variant(), default=dict)
