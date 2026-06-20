from __future__ import annotations

from datetime import datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import select

from app.core.security import get_password_hash
from app.db.session import SessionLocal
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
    PropertyImage,
    User,
    ViewingAppointment,
)


PROJECTS = [
    "Midtown",
    "Sky Garden",
    "Scenic Valley",
    "Happy Valley",
    "Riverside Residence",
    "Green Valley",
    "Nam Phuc",
    "Panorama",
    "Star Hill",
    "Chateau",
    "Grand View",
    "Garden Court",
    "My Phu",
    "My Vien",
    "My Khang",
    "My Canh",
]


def slugify(value: str) -> str:
    return value.lower().replace(" ", "-").replace("/", "-")


def seed() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(User).where(User.email == "admin@pmhhomes.local")):
            print("Seed data already exists; skipping.")
            return

        admin = User(email="admin@pmhhomes.local", full_name="Phu My Hung Admin", role="admin", hashed_password=get_password_hash("password123"))
        manager = User(email="manager@pmhhomes.local", full_name="Phu My Hung Sales Manager", role="manager", hashed_password=get_password_hash("password123"))
        brokers = [
            User(email=f"broker{i}@pmhhomes.local", full_name=f"Phu My Hung Broker {i}", role="broker", hashed_password=get_password_hash("password123"))
            for i in range(1, 4)
        ]
        viewer = User(email="viewer@pmhhomes.local", full_name="Phu My Hung Viewer", role="viewer", hashed_password=get_password_hash("password123"))
        db.add_all([admin, manager, *brokers, viewer])
        db.flush()
        for broker in brokers:
            broker.manager_id = manager.id

        projects: list[Project] = []
        for index, name in enumerate(PROJECTS, start=1):
            projects.append(
                Project(
                    name=name,
                    slug=slugify(name),
                    description=f"{name} is a preferred Phu My Hung community with strong rental demand, walkable amenities, and verified homes.",
                    property_types=["apartment", "villa", "townhouse", "shophouse", "office"] if name in {"Midtown", "Star Hill"} else ["apartment"],
                    amenities=["pool", "gym", "security", "parks", "retail podium"],
                    nearby_places=["Crescent Mall", "Starlight Bridge", "Sakura Park", "International schools"],
                    images=[f"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80&sig={index}"],
                    sort_order=index,
                )
            )
        db.add_all(projects)
        db.flush()

        owners = [
            Owner(
                full_name=f"Phu My Hung Owner {i:02d}",
                phone=f"+8490900{i:04d}",
                email=f"owner{i}@pmhhomes.local",
                zalo=f"+8490900{i:04d}",
                whatsapp=f"+8490900{i:04d}",
                nationality="Vietnamese" if i % 3 else "Korean",
                preferred_language="vi" if i % 2 else "en",
                address="District 7, Ho Chi Minh City",
                notes="Prefers verified Phu My Hung tenant profiles.",
                assigned_user_id=brokers[i % len(brokers)].id,
            )
            for i in range(1, 21)
        ]
        db.add_all(owners)
        db.flush()

        view_types = ["river", "park", "city", "garden", "pool", "street"]
        property_types = ["apartment", "villa", "townhouse", "shophouse", "office"]
        properties: list[Property] = []
        now = datetime.now(timezone.utc)
        for i in range(1, 41):
            listing_type = "rent" if i % 2 else "sale"
            project = projects[(i - 1) % len(projects)]
            property_type = property_types[i % len(property_types)] if i % 9 == 0 else "apartment"
            bedrooms = (i % 4) + 1
            area = Decimal(55 + i * 3)
            property_ = Property(
                code=f"PMH-{i:04d}",
                slug=f"phu-my-hung-{slugify(project.name)}-{i:04d}",
                title=f"Verified {bedrooms}-bedroom {project.name} {property_type} in Phu My Hung",
                listing_type=listing_type,
                property_type=property_type,
                status="available" if i % 7 else "reserved",
                project_id=project.id,
                owner_id=owners[i % len(owners)].id,
                assigned_user_id=brokers[i % len(brokers)].id,
                address_detail=f"{project.name}, Phu My Hung, District 7",
                tower_block=f"Block {chr(65 + (i % 4))}",
                floor=str((i % 28) + 2),
                unit_number=f"{100 + i}",
                bedrooms=bedrooms,
                bathrooms=max(1, bedrooms - 1),
                area_sqm=area,
                rental_price=Decimal(18000000 + i * 900000) if listing_type == "rent" else None,
                sale_price=Decimal(4500000000 + i * 150000000) if listing_type == "sale" else None,
                currency="VND",
                management_fee=Decimal(2500000),
                deposit_amount=Decimal(36000000) if listing_type == "rent" else None,
                furniture_status=["unfurnished", "basic", "fully_furnished", "luxury"][i % 4],
                view_type=view_types[i % len(view_types)],
                balcony=i % 2 == 0,
                pet_friendly=i % 5 == 0,
                parking=i % 3 == 0,
                available_from=now + timedelta(days=i % 20),
                legal_status="Pink book ready" if listing_type == "sale" else "Owner authorization verified",
                description_vi=f"Can ho Phu My Hung tai {project.name}, da xac minh, phu hop khach gia dinh va chuyen gia.",
                description_en=f"Verified Phu My Hung home at {project.name}, suitable for families and international professionals.",
                internal_notes="Owner confirmed viewing windows with Phu My Hung Homes.",
                is_verified=i % 3 != 0,
                is_featured=i <= 10,
            )
            properties.append(property_)
        db.add_all(properties)
        db.flush()
        for property_ in properties:
            db.add(
                PropertyImage(
                    property_id=property_.id,
                    image_url=f"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80&sig={property_.id}",
                    caption=f"{property_.title} living area",
                    sort_order=1,
                    is_cover=True,
                )
            )

        customers: list[Customer] = []
        for i in range(1, 31):
            customer = Customer(
                full_name=f"Phu My Hung Customer {i:02d}",
                phone=f"+8488800{i:04d}",
                email=f"customer{i}@pmhhomes.local",
                zalo=f"+8488800{i:04d}",
                whatsapp=f"+8488800{i:04d}",
                nationality=["Vietnamese", "Japanese", "Korean", "Singaporean"][i % 4],
                preferred_language=["vi", "en", "ko", "ja"][i % 4],
                customer_type=["tenant", "buyer", "investor", "company"][i % 4],
                source=["website", "referral", "facebook", "zalo", "walk_in"][i % 5],
                status=["new", "contacted", "qualified", "viewing", "negotiating"][i % 5],
                assigned_user_id=brokers[i % len(brokers)].id,
                notes="Looking only inside Phu My Hung.",
            )
            customers.append(customer)
        db.add_all(customers)
        db.flush()

        for i, customer in enumerate(customers[:20], start=1):
            db.add(
                CustomerRequirement(
                    customer_id=customer.id,
                    listing_type="rent" if i % 2 else "sale",
                    property_type="apartment",
                    preferred_projects=[projects[i % len(projects)].id, projects[(i + 1) % len(projects)].id],
                    min_bedrooms=1,
                    max_bedrooms=3,
                    min_area=Decimal(60),
                    max_area=Decimal(160),
                    min_budget=Decimal(18000000 if i % 2 else 4500000000),
                    max_budget=Decimal(45000000 if i % 2 else 9000000000),
                    currency="VND",
                    move_in_date=now + timedelta(days=30),
                    furniture_required="fully_furnished" if i % 3 == 0 else None,
                    pet_friendly_required=i % 5 == 0,
                    balcony_required=True,
                    parking_required=i % 4 == 0,
                    preferred_view=view_types[i % len(view_types)],
                    lifestyle_notes="Wants walkable Phu My Hung lifestyle near parks, cafes, and schools.",
                    priority_level=["low", "medium", "high"][i % 3],
                )
            )

        for i in range(15):
            db.add(
                ViewingAppointment(
                    customer_id=customers[i].id,
                    property_id=properties[i].id,
                    assigned_user_id=brokers[i % len(brokers)].id,
                    scheduled_at=now + timedelta(days=i, hours=10),
                    status=["scheduled", "completed", "rescheduled"][i % 3],
                    meeting_location="Phu My Hung Sales Gallery",
                    broker_notes="Prepare building access and owner confirmation.",
                    next_follow_up_at=now + timedelta(days=i + 1),
                )
            )

        deals: list[Deal] = []
        stages = ["new", "qualified", "viewing", "offer", "negotiation", "deposit", "contract", "closed_won", "closed_lost"]
        for i in range(12):
            property_ = properties[i]
            value = property_.rental_price or property_.sale_price or Decimal(0)
            commission = value * Decimal("0.01")
            deal = Deal(
                customer_id=customers[i].id,
                property_id=property_.id,
                owner_id=property_.owner_id,
                assigned_user_id=brokers[i % len(brokers)].id,
                deal_type=property_.listing_type,
                stage=stages[i % len(stages)],
                expected_value=value,
                final_value=value if stages[i % len(stages)] == "closed_won" else None,
                commission_rate=Decimal("1.0"),
                commission_amount=commission,
                expected_close_date=now + timedelta(days=20 + i),
                closed_at=now if stages[i % len(stages)] == "closed_won" else None,
                notes="Phu My Hung transaction pipeline.",
            )
            deals.append(deal)
        db.add_all(deals)
        db.flush()
        for deal in deals[:8]:
            gross = deal.commission_amount or Decimal(0)
            db.add(
                Commission(
                    deal_id=deal.id,
                    broker_id=deal.assigned_user_id or brokers[0].id,
                    gross_commission=gross,
                    company_share=gross * Decimal("0.50"),
                    broker_share=gross * Decimal("0.50"),
                    payment_status="paid" if deal.stage == "closed_won" else "pending",
                    note="Phu My Hung Homes commission split.",
                )
            )

        db.add(
            CompanySettings(
                company_name="Phu My Hung Homes",
                phone="+84 28 5411 0000",
                email="hello@pmhhomes.local",
                address="Crescent area, Phu My Hung, District 7, Ho Chi Minh City",
                website="https://pmhhomes.local",
                zalo="+84 90 000 0000",
                whatsapp="+84 90 000 0000",
                seo_title="Phu My Hung Homes CRM - Verified Rentals and Sales",
                seo_description="Specialized Phu My Hung property portal and broker CRM for verified homes, owners, customers, deals, and commissions.",
            )
        )
        for action in ["property created", "customer created", "appointment scheduled", "deal stage changed", "note added", "property status changed"]:
            db.add(Activity(actor_user_id=admin.id, entity_type="system", entity_id=None, action=action, note=f"Seeded {action} for Phu My Hung Homes CRM."))
        db.commit()
        print("Seeded Phu My Hung Homes CRM demo data.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
