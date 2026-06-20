from __future__ import annotations

import os
from collections.abc import Generator
from datetime import datetime, timedelta, timezone
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = "test-secret"

from app.core.security import get_password_hash  # noqa: E402
from app.db.session import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Customer, CustomerRequirement, Deal, Owner, Project, Property, User  # noqa: E402


engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture()
def db() -> Generator[Session, None, None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    seed_minimal(session)
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def admin_headers(client: TestClient) -> dict[str, str]:
    response = client.post("/api/v1/auth/login", json={"email": "admin@pmhhomes.local", "password": "password123"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture()
def viewer_headers(client: TestClient) -> dict[str, str]:
    response = client.post("/api/v1/auth/login", json={"email": "viewer@pmhhomes.local", "password": "password123"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture()
def broker_headers(client: TestClient) -> dict[str, str]:
    response = client.post("/api/v1/auth/login", json={"email": "broker1@pmhhomes.local", "password": "password123"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def seed_minimal(db: Session) -> None:
    admin = User(email="admin@pmhhomes.local", full_name="Admin", role="admin", hashed_password=get_password_hash("password123"))
    broker = User(email="broker1@pmhhomes.local", full_name="Broker", role="broker", hashed_password=get_password_hash("password123"))
    other_broker = User(email="broker2@pmhhomes.local", full_name="Other Broker", role="broker", hashed_password=get_password_hash("password123"))
    viewer = User(email="viewer@pmhhomes.local", full_name="Viewer", role="viewer", hashed_password=get_password_hash("password123"))
    db.add_all([admin, broker, other_broker, viewer])
    db.flush()
    project = Project(name="Midtown", slug="midtown", description="Midtown Phu My Hung", property_types=["apartment"], amenities=["pool"], nearby_places=["Sakura Park"])
    db.add(project)
    db.flush()
    owner = Owner(full_name="Owner One", phone="+84900000000", assigned_user_id=broker.id)
    db.add(owner)
    db.flush()
    property_ = Property(
        code="PMH-TEST",
        slug="phu-my-hung-midtown-test",
        title="Verified Midtown 2-bedroom apartment in Phu My Hung",
        listing_type="rent",
        property_type="apartment",
        status="available",
        project_id=project.id,
        owner_id=owner.id,
        assigned_user_id=broker.id,
        bedrooms=2,
        bathrooms=2,
        area_sqm=Decimal("88"),
        rental_price=Decimal("28000000"),
        currency="VND",
        furniture_status="fully_furnished",
        view_type="park",
        balcony=True,
        pet_friendly=True,
        parking=True,
        available_from=datetime.now(timezone.utc) + timedelta(days=5),
        description_en="Verified Phu My Hung Midtown apartment.",
        is_verified=True,
        is_featured=True,
    )
    customer = Customer(full_name="Customer One", phone="+84800000000", status="qualified", assigned_user_id=broker.id)
    other_property = Property(
        code="PMH-OTHER",
        slug="phu-my-hung-other-broker",
        title="Verified other broker Phu My Hung apartment",
        listing_type="rent",
        property_type="apartment",
        status="available",
        project_id=project.id,
        owner_id=owner.id,
        assigned_user_id=other_broker.id,
        bedrooms=1,
        bathrooms=1,
        area_sqm=Decimal("60"),
        rental_price=Decimal("21000000"),
        currency="VND",
        furniture_status="basic",
        view_type="city",
        available_from=datetime.now(timezone.utc) + timedelta(days=5),
        description_en="Assigned to another Phu My Hung broker.",
        is_verified=True,
    )
    db.add_all([property_, other_property, customer])
    db.flush()
    requirement = CustomerRequirement(
        customer_id=customer.id,
        listing_type="rent",
        property_type="apartment",
        preferred_projects=[project.id],
        min_bedrooms=2,
        max_bedrooms=3,
        min_budget=Decimal("20000000"),
        max_budget=Decimal("35000000"),
        move_in_date=datetime.now(timezone.utc) + timedelta(days=30),
        furniture_required="fully_furnished",
        pet_friendly_required=True,
        balcony_required=True,
        parking_required=True,
        preferred_view="park",
    )
    deal = Deal(customer_id=customer.id, property_id=property_.id, owner_id=owner.id, assigned_user_id=broker.id, deal_type="rent", stage="new")
    db.add_all([requirement, deal])
    db.commit()
