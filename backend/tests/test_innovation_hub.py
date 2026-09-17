from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_innovation_hub_challenges():
    client.post("/api/v1/demo/reset")
    # List challenges
    res = client.get("/api/v1/innovation-hub/challenges")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) >= 3

    # Filter by domain
    filter_res = client.get("/api/v1/innovation-hub/challenges?domain=Urban")
    assert filter_res.status_code == 200
    assert len(filter_res.json()["items"]) >= 1

    # Search
    search_res = client.get("/api/v1/innovation-hub/challenges?q=Road")
    assert search_res.status_code == 200
    assert len(search_res.json()["items"]) >= 1

    # Get single challenge
    first_id = data["items"][0]["id"]
    single_res = client.get(f"/api/v1/innovation-hub/challenges/{first_id}")
    assert single_res.status_code == 200
    assert single_res.json()["id"] == first_id


def test_innovation_hub_solution_submission_and_review():
    client.post("/api/v1/demo/reset")
    # 1. Submit solution
    submit_res = client.post(
        "/api/v1/innovation-hub/challenges/ihub-ch-001/solutions",
        json={
            "challenge_id": "ihub-ch-001",
            "solution_name": "VisionRoad AI",
            "company": "SmartTech Innovations",
            "category": "Computer Vision",
            "short_description": "Edge AI camera road condition monitor.",
            "technical_capabilities": "94% recall, edge inference, real-time alert.",
            "technology_stack": "PyTorch, TensorRT, FastAPI",
            "deployment_model": "Bus mounted cameras + edge compute",
            "previous_deployments": "Tested on 10 buses in Indore",
            "government_experience": "Indore Smart City pilot",
            "evidence_summary": "Third-party audit report from CEPT",
            "implementation_timeline": "60 days",
            "contact_email": "contact@smarttech.local",
        },
    )
    assert submit_res.status_code == 200
    sol = submit_res.json()
    sol_id = sol["id"]
    assert sol["solution_name"] == "VisionRoad AI"
    assert sol["status"] == "Submitted"
    assert sol["evidence_validation"] == "Not yet verified"

    # 2. Check review queue
    queue_res = client.get("/api/v1/innovation-hub/review-queue")
    assert queue_res.status_code == 200
    items = queue_res.json()["items"]
    assert any(item["solution_id"] == sol_id for item in items)

    # 3. Shortlist solution
    shortlist_res = client.post(
        f"/api/v1/innovation-hub/solutions/{sol_id}/shortlist",
        json={"reason": "Meets edge inference and detection requirements."},
    )
    assert shortlist_res.status_code == 200
    assert shortlist_res.json()["shortlisted"] is True
    assert shortlist_res.json()["status"] == "Shortlisted"

    # 4. Move to validation -> links to PRAMAN Case 1042
    val_res = client.post(
        f"/api/v1/innovation-hub/solutions/{sol_id}/move-to-validation",
        json={"reason": "Approved for 90-day sandbox pilot testing in Pune.", "link_to_existing_case": True},
    )
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["praman_case_id"] == "1042"
    assert val_data["solution"]["status"] == "Validation Candidate"
