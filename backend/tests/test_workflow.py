from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_hero_workflow_end_to_end():
    assert client.post("/api/v1/demo/reset").json()["status"] == "reset"
    assert client.get("/api/v1/health").json()["status"] == "READY FOR DEMO"
    assert client.post("/api/v1/problems/1042/structure").json()["status"] == "Generated"
    assert client.post("/api/v1/problems/1042/requirements/approve").json()["status"] == "Approved"
    match = client.post("/api/v1/match").json()
    assert match["results"][0]["startup"]["name"] == "SkylineAI Solutions"
    pilot = client.post("/api/v1/recommendations/rec-startup-skyline/shortlist").json()["pilot"]
    pilot_id = pilot["id"]
    assert client.post(f"/api/v1/pilots/{pilot_id}/fast-forward").json()["success"]["overall"] == 91
    assert client.post(f"/api/v1/procurement-readiness/{pilot_id}/calculate").json()["score"] == 91
    decision = client.post(
        "/api/v1/decisions",
        json={"pilot_id": pilot_id, "decision": "Proceed to Procurement Review", "reason": "Evidence supports human procurement review.", "comment": "Security questionnaire must be completed."},
    ).json()
    assert "Human reviewer" in decision["status"]
    assert client.post(f"/api/v1/export/handoff/{pilot_id}").json()["title"] == "PROCUREMENT HANDOFF PACK"
    assert client.post("/api/v1/scale-recommendations/scale-mumbai/request-consent").json()["status"] == "PENDING DEPARTMENT CONSENT"
