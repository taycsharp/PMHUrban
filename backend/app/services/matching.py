from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from app.models import CustomerRequirement, Property


def _price_for(property_: Property) -> Decimal | None:
    return property_.rental_price if property_.listing_type == "rent" else property_.sale_price


def _aware(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def score_property(requirement: CustomerRequirement, property_: Property) -> dict:
    score = 0
    matched: list[str] = []
    missing: list[str] = []

    price = _price_for(property_)
    if price is not None and (requirement.min_budget is None or price >= requirement.min_budget) and (
        requirement.max_budget is None or price <= requirement.max_budget
    ):
        score += 30
        matched.append("Budget fits the Phu My Hung requirement")
    else:
        missing.append("Budget is outside the preferred range")

    if (requirement.min_bedrooms is None or property_.bedrooms >= requirement.min_bedrooms) and (
        requirement.max_bedrooms is None or property_.bedrooms <= requirement.max_bedrooms
    ):
        score += 15
        matched.append("Bedroom count matches")
    else:
        missing.append("Bedroom count does not match")

    if not requirement.preferred_projects or property_.project_id in requirement.preferred_projects:
        score += 15
        matched.append("Preferred Phu My Hung project/building")
    else:
        missing.append("Project is not in the preferred Phu My Hung shortlist")

    if not requirement.property_type or property_.property_type == requirement.property_type:
        score += 10
        matched.append("Property type matches")
    else:
        missing.append("Property type differs")

    if not requirement.furniture_required or property_.furniture_status == requirement.furniture_required:
        score += 10
        matched.append("Furniture status matches")
    else:
        missing.append("Furniture status differs")

    available_from = _aware(property_.available_from)
    move_in_date = _aware(requirement.move_in_date)

    if not move_in_date or not available_from or available_from <= move_in_date:
        score += 10
        matched.append("Availability timing works")
    else:
        missing.append("Availability is later than desired")

    preference_points = 0
    preference_checks = [
        (not requirement.pet_friendly_required or property_.pet_friendly, "Pet friendly"),
        (not requirement.balcony_required or property_.balcony, "Balcony"),
        (not requirement.parking_required or property_.parking, "Parking"),
        (not requirement.preferred_view or property_.view_type == requirement.preferred_view, "Preferred view"),
    ]
    for ok, label in preference_checks:
        if ok:
            preference_points += 2.5
            matched.append(f"{label} preference matches")
        else:
            missing.append(f"{label} preference missing")
    score += int(preference_points)

    if property_.listing_type != requirement.listing_type:
        score = 0
        matched = []
        missing.append("Listing type does not match rent/sale intent")

    action = "Schedule a Phu My Hung viewing" if score >= 75 else "Review trade-offs with the customer"
    if available_from and available_from > datetime.now(timezone.utc):
        action = "Confirm availability date with the owner before viewing"

    return {
        "property": property_,
        "score": min(score, 100),
        "matched_reasons": matched,
        "missing_criteria": missing,
        "recommended_next_action": action,
    }
