from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_auth_flow():
    client.post("/api/v1/demo/reset")
    login_res = client.post("/api/v1/auth/login", json={"email": "officer@praman.local", "password": "demo123"})
    assert login_res.status_code == 200
    assert login_res.json()["mfa_required"] is True

    mfa_res = client.post("/api/v1/auth/mfa/verify", json={"email": "officer@praman.local", "code": "123456"})
    assert mfa_res.status_code == 200
    token = mfa_res.json()["access_token"]
    assert token is not None


def test_problem_intake():
    client.post("/api/v1/demo/reset")
    res = client.post(
        "/api/v1/problems",
        json={
            "title": "Smart Traffic Signal Optimization",
            "department": "Transport",
            "narrative": "Optimize traffic light signals using computer vision telemetry.",
            "location": "Pune",
            "domain": "Transportation",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Smart Traffic Signal Optimization"
    assert data["status"] == "Submitted"


def test_workflow_gates_and_blockers():
    client.post("/api/v1/demo/reset")
    # Gate 1: Requirement not approved -> Match must fail
    client.post("/api/v1/problems/1042/structure")
    match_fail = client.post("/api/v1/match")
    assert match_fail.status_code == 409

    # Approve requirement -> Match succeeds
    client.post("/api/v1/problems/1042/requirements/approve")
    match_ok = client.post("/api/v1/match")
    assert match_ok.status_code == 200

    # Shortlist & Pilot
    shortlist_res = client.post("/api/v1/recommendations/rec-startup-skyline/shortlist")
    pilot_id = shortlist_res.json()["pilot"]["id"]

    # Gate 2: Handoff before decision must fail
    handoff_fail = client.post(f"/api/v1/export/handoff/{pilot_id}")
    assert handoff_fail.status_code == 409

    # Fast forward pilot & calculate readiness
    client.post(f"/api/v1/pilots/{pilot_id}/fast-forward")
    client.post(f"/api/v1/procurement-readiness/{pilot_id}/calculate")

    # Decision submission
    client.post(
        "/api/v1/decisions",
        json={"pilot_id": pilot_id, "decision": "Proceed to Procurement Review", "reason": "Evidence validated."},
    )

    # Handoff now succeeds
    handoff_ok = client.post(f"/api/v1/export/handoff/{pilot_id}")
    assert handoff_ok.status_code == 200

    # Implementation & Blocker Resolution
    client.post("/api/v1/implementation/1042")
    blockers_before = client.get("/api/v1/implementation/1042/blockers").json()
    assert blockers_before["total"] > 0

    res_blocker = client.patch("/api/v1/implementation/1042/tasks/task-02/resolve-blocker")
    assert res_blocker.status_code == 200
    assert "task-02" in res_blocker.json()["task"]["id"]


def test_post_procurement_lifecycle():
    client.post("/api/v1/demo/reset")
    # Monitoring
    mon = client.post(
        "/api/v1/monitoring/1042",
        json={
            "month": "Month 4",
            "period": "Feb 2027",
            "accuracy_pct": 94.5,
            "uptime_pct": 99.2,
            "cost_lakh": 1.5,
            "issues_count": 0,
            "notes": "Optimal steady-state operational performance.",
        },
    )
    assert mon.status_code == 200
    assert mon.json()["accuracy_pct"] == 94.5

    # Lessons
    lesson = client.post(
        "/api/v1/lessons/1042",
        json={
            "category": "Governance",
            "lesson": "Early stakeholder alignment accelerates deployment.",
            "recommendation": "Form cross-departmental committee at intake.",
        },
    )
    assert lesson.status_code == 200

    # Institutional Memory search
    search_res = client.get("/api/v1/institutional-memory/search?q=pune")
    assert search_res.status_code == 200
    assert len(search_res.json()["items"]) > 0

    # Reuse recommendations
    reuse_res = client.get("/api/v1/reuse-recommendations?problem_id=1042")
    assert reuse_res.status_code == 200
    assert len(reuse_res.json()["items"]) > 0


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

