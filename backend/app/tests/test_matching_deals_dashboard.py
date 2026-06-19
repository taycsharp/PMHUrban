def test_matching_score(client, admin_headers):
    response = client.get("/api/v1/matching/1", headers=admin_headers)
    assert response.status_code == 200
    matches = response.json()
    assert matches[0]["score"] >= 90
    assert "Phu My Hung" in matches[0]["recommended_next_action"] or matches[0]["score"] == 100


def test_deal_stage_update(client, admin_headers):
    response = client.patch("/api/v1/deals/1/stage", json={"stage": "closed_won", "note": "Won in Phu My Hung"}, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["stage"] == "closed_won"


def test_dashboard_summary(client, admin_headers):
    response = client.get("/api/v1/dashboard", headers=admin_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total_properties"] >= 1
    assert "open_deals" in body

