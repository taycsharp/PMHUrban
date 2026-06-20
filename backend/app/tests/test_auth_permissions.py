def test_auth_login_returns_jwt(client):
    response = client.post("/api/v1/auth/login", json={"email": "admin@pmhhomes.local", "password": "password123"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    assert response.json()["user"]["role"] == "admin"


def test_viewer_cannot_create_property(client, viewer_headers):
    payload = {
        "code": "PMH-NOPE",
        "slug": "phu-my-hung-nope",
        "title": "Phu My Hung read only check",
        "listing_type": "rent",
        "property_type": "apartment",
        "project_id": 1,
    }
    response = client.post("/api/v1/properties", json=payload, headers=viewer_headers)
    assert response.status_code == 403


def test_broker_only_sees_assigned_properties(client, broker_headers):
    response = client.get("/api/v1/properties", headers=broker_headers)
    assert response.status_code == 200
    codes = {item["code"] for item in response.json()}
    assert "PMH-TEST" in codes
    assert "PMH-OTHER" not in codes


def test_broker_cannot_open_other_broker_property(client, broker_headers):
    response = client.get("/api/v1/properties/2", headers=broker_headers)
    assert response.status_code == 403
