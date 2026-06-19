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

