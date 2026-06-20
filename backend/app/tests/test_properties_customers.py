from pathlib import Path

from app.core.config import get_settings


def test_property_crud_create_and_list(client, admin_headers):
    payload = {
        "code": "PMH-NEW",
        "slug": "phu-my-hung-midtown-new",
        "title": "Verified Midtown studio in Phu My Hung",
        "listing_type": "rent",
        "property_type": "apartment",
        "status": "available",
        "project_id": 1,
        "bedrooms": 1,
        "bathrooms": 1,
        "area_sqm": "55",
        "rental_price": "22000000",
        "currency": "VND",
        "is_verified": True,
    }
    created = client.post("/api/v1/properties", json=payload, headers=admin_headers)
    assert created.status_code == 200
    listed = client.get("/api/v1/properties", headers=admin_headers)
    assert listed.status_code == 200
    assert any(item["code"] == "PMH-NEW" for item in listed.json())


def test_property_image_upload_uses_local_storage_config(client, admin_headers, tmp_path):
    settings = get_settings()
    original_dir = settings.upload_dir
    original_base_url = settings.upload_public_base_url
    settings.upload_dir = str(tmp_path)
    settings.upload_public_base_url = "http://testserver"
    try:
        uploaded = client.post(
            "/api/v1/properties/1/images",
            data={"caption": "Living room", "is_cover": "true"},
            files={"file": ("living-room.jpg", b"\xff\xd8\xff\xe0local-image", "image/jpeg")},
            headers=admin_headers,
        )
    finally:
        settings.upload_dir = original_dir
        settings.upload_public_base_url = original_base_url

    assert uploaded.status_code == 200
    images = uploaded.json()["images"]
    assert len(images) == 1
    assert images[0]["caption"] == "Living room"
    assert images[0]["is_cover"] is True
    assert images[0]["image_url"].startswith("http://testserver/uploads/properties/1/")
    assert Path(str(tmp_path), "properties", "1").is_dir()
    assert len(list(Path(str(tmp_path), "properties", "1").glob("*.jpg"))) == 1


def test_public_property_filters_apply_to_verified_inventory(client):
    filtered = client.get(
        "/api/v1/public/properties",
        params={
            "listing_type": "rent",
            "property_type": "apartment",
            "bedrooms": 2,
            "bathrooms": 2,
            "min_area": 80,
            "max_area": 90,
            "min_price": 25000000,
            "max_price": 30000000,
            "furniture_status": "fully_furnished",
            "view_type": "park",
            "pet_friendly": True,
            "balcony": True,
            "parking": True,
            "q": "Midtown",
        },
    )
    assert filtered.status_code == 200
    assert [item["code"] for item in filtered.json()] == ["PMH-TEST"]

    empty = client.get("/api/v1/public/properties", params={"listing_type": "rent", "max_price": 1000000})
    assert empty.status_code == 200
    assert empty.json() == []


def test_customer_crud_create_and_list(client, admin_headers):
    payload = {
        "full_name": "Phu My Hung Test Buyer",
        "phone": "+84912345678",
        "customer_type": "buyer",
        "source": "website",
        "status": "new",
    }
    created = client.post("/api/v1/customers", json=payload, headers=admin_headers)
    assert created.status_code == 200
    listed = client.get("/api/v1/customers", headers=admin_headers)
    assert any(item["full_name"] == "Phu My Hung Test Buyer" for item in listed.json())
