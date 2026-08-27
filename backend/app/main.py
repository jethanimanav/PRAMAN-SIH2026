from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import create_token
from app.services.demo.store import DATA_CLASS, STATE, audit, reset_state
from app.services.export.handoff import build_handoff
from app.services.matching.engine import match
from app.services.scoring.readiness import PILOT_KPIS, pilot_success, readiness

app = FastAPI(title="PRAMAN API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


class MfaRequest(BaseModel):
    email: str
    code: str


class DecisionRequest(BaseModel):
    pilot_id: str
    decision: str
    reason: str
    comment: str | None = None
    officer_identity: str = "Ananya Deshmukh"


def problem_1042() -> dict:
    return STATE["problems"][0]


def require_requirement() -> dict:
    requirement = STATE["requirements"].get("1042")
    if not requirement:
        raise HTTPException(status_code=409, detail="Requirement has not been structured.")
    return requirement


def require_recommendation() -> dict:
    if not STATE["recommendations"]:
        raise HTTPException(status_code=409, detail="Matching has not been run.")
    return STATE["recommendations"][0]


@app.get("/api/v1/health")
def health() -> dict:
    checks = {
        "database": "fallback-ready",
        "seed_data": "ok",
        "hero_scenario": "ok",
        "matching_engine": "ok",
        "kpi_data": "ok",
        "readiness_engine": "ok",
        "handoff_generator": "ok",
    }
    return {"status": "READY FOR DEMO", "engine": settings.engine_label, "checks": checks, "data_class": DATA_CLASS}


@app.post("/api/v1/auth/login")
def login(payload: LoginRequest) -> dict:
    user = next((item for item in STATE["users"] if item["email"] == payload.email), None)
    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid demo credentials")
    return {"mfa_required": True, "email": payload.email, "data_class": DATA_CLASS}


@app.post("/api/v1/auth/mfa/verify")
def verify_mfa(payload: MfaRequest) -> dict:
    user = next((item for item in STATE["users"] if item["email"] == payload.email), None)
    if not user or user["mfa"] != payload.code:
        raise HTTPException(status_code=401, detail="Invalid simulated MFA code")
    return {"access_token": create_token(user["id"], user["role"]), "token_type": "bearer", "user": user, "data_class": DATA_CLASS}


@app.get("/api/v1/dashboard/summary")
def dashboard() -> dict:
    return {
        "problems": 20,
        "startups": 100,
        "pilots": 8,
        "hero_status": STATE["stage"],
        "demo_mode": True,
        "engine": settings.engine_label,
        "data_class": DATA_CLASS,
    }


@app.get("/api/v1/problems")
def list_problems() -> dict:
    return {"items": STATE["problems"], "data_class": DATA_CLASS}


@app.get("/api/v1/problems/{problem_id}")
def get_problem(problem_id: str) -> dict:
    if problem_id != "1042":
        raise HTTPException(status_code=404, detail="Only the hero problem is deeply interactive in this prototype.")
    return problem_1042()


@app.post("/api/v1/problems/{problem_id}/structure")
def structure_problem(problem_id: str) -> dict:
    problem = get_problem(problem_id)
    requirement = {
        "id": "req-1042-v1",
        "problem_id": problem_id,
        "status": "Generated",
        "domain": "Urban Infrastructure",
        "technology": "Computer Vision",
        "problem_type": "Road damage detection using public transport telemetry",
        "kpis": [{"name": "Road-damage detection recall", "target": "≥ 90%", "confidence": "HIGH"}],
        "geography": "Pune Municipal Bus Fleet",
        "deployment": "Municipal bus fleet + field inspection workflow",
        "budget": "₹50L – ₹1Cr",
        "timeline": "90 days",
        "constraints": ["Night-time false positives"],
        "security": "Security questionnaire + deployment review required.",
        "data_requirements": ["Bus camera frames", "GPS traces", "Geotagged alert events"],
        "confidence": {"overall": "HIGH", "fields": {"technology": "HIGH", "kpis": "HIGH", "security": "MEDIUM"}},
        "data_class": DATA_CLASS,
    }
    STATE["requirements"][problem_id] = requirement
    STATE["stage"] = "structuring"
    audit("Requirement Generated", "Requirement req-1042-v1", reason="PRAMAN structured the simulated problem")
    return requirement


@app.post("/api/v1/problems/{problem_id}/requirements/approve")
def approve_requirement(problem_id: str) -> dict:
    requirement = require_requirement()
    requirement["status"] = "Approved"
    STATE["stage"] = "matching"
    audit("Requirement Approved", "Requirement req-1042-v1", reason="Officer approved requirement for matching")
    return requirement


@app.post("/api/v1/match")
def run_match() -> dict:
    requirement = require_requirement()
    if requirement["status"] != "Approved":
        raise HTTPException(status_code=409, detail="Requirement approval is required before matching.")
    result = match(problem_1042(), STATE["startups"])
    STATE["recommendations"] = result["results"]
    STATE["stage"] = "matched"
    audit("Eligibility Checked", "Problem #1042", reason="Deterministic eligibility checks completed")
    audit("Match Generated", "Problem #1042", reason="BM25 + dense interface + RRF + TOPSIS generated recommendations")
    return result


@app.get("/api/v1/recommendations/{problem_id}")
def recommendations(problem_id: str) -> dict:
    if problem_id != "1042":
        raise HTTPException(status_code=404, detail="No recommendations found.")
    return {"items": STATE["recommendations"], "data_class": DATA_CLASS}


@app.post("/api/v1/recommendations/{recommendation_id}/shortlist")
def shortlist(recommendation_id: str) -> dict:
    recommendation = next((item for item in STATE["recommendations"] if item["id"] == recommendation_id), None)
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found.")
    recommendation["shortlisted"] = True
    pilot = {
        "id": "pilot-1042-skyline",
        "name": "AI Road Damage Detection",
        "startup": "SkylineAI Solutions",
        "department": "Urban Development / PWD",
        "location": "Pune",
        "budget": "₹75,00,000",
        "status": "Pilot Created",
        "timeline": ["Pilot Created", "Baseline Captured", "Field Deployment", "Midpoint Review", "Final Evaluation", "Readiness Review"],
        "objectives": ["validate detection quality", "test municipal bus deployment", "measure field usefulness", "measure cost improvement", "assess reliability", "assess scale readiness"],
        "kpis": [],
        "success": None,
        "readiness": None,
        "data_class": DATA_CLASS,
    }
    STATE["pilots"][pilot["id"]] = pilot
    STATE["stage"] = "pilot"
    audit("Startup Shortlisted", recommendation["startup"]["name"], reason="SkylineAI selected for controlled pilot")
    audit("Pilot Created", pilot["id"], reason="Shortlisted startup converted to pilot workspace")
    return {"recommendation": recommendation, "pilot": pilot, "data_class": DATA_CLASS}


@app.post("/api/v1/recommendations/{recommendation_id}/override-rank")
def override_rank(recommendation_id: str, reason: str) -> dict:
    if not reason:
        raise HTTPException(status_code=422, detail="Human override reason is required.")
    audit("HUMAN_RANK_OVERRIDE", recommendation_id, reason=reason)
    return {"status": "recorded", "data_class": DATA_CLASS}


@app.post("/api/v1/eligibility/check")
def eligibility_check() -> dict:
    if not STATE["recommendations"]:
        run_match()
    return {"items": [item["eligibility"] for item in STATE["recommendations"]], "data_class": DATA_CLASS}


@app.get("/api/v1/eligibility/{startup_id}/{problem_id}")
def eligibility_for(startup_id: str, problem_id: str) -> dict:
    recommendation = next((item for item in STATE["recommendations"] if item["startup"]["id"] == startup_id), None)
    if not recommendation:
        raise HTTPException(status_code=404, detail="Eligibility result not found.")
    return recommendation["eligibility"]


@app.get("/api/v1/pilots/{pilot_id}")
def get_pilot(pilot_id: str) -> dict:
    pilot = STATE["pilots"].get(pilot_id)
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot has not started.")
    return pilot


@app.post("/api/v1/pilots/{pilot_id}/fast-forward")
def fast_forward_pilot(pilot_id: str) -> dict:
    pilot = get_pilot(pilot_id)
    pilot["status"] = "Final Evaluation"
    pilot["kpis"] = PILOT_KPIS
    pilot["success"] = pilot_success()
    STATE["evidence"] = [
        {"name": "Detection_Report_May.pdf", "category": "Technical", "type": "PDF", "uploader": "Pilot Evaluator", "date": "2026-05-28", "verification": "Checked", "related_kpi": "Detection Recall", "hash": "AUD-SIM-001", "data_class": DATA_CLASS},
        {"name": "Field_Photos_Sample.zip", "category": "Performance", "type": "ZIP", "uploader": "Field Team", "date": "2026-05-29", "verification": "Sampled", "related_kpi": "False Positive Rate", "hash": "AUD-SIM-002", "data_class": DATA_CLASS},
        {"name": "KPI_Summary_May.xlsx", "category": "Commercial", "type": "XLSX", "uploader": "Evaluator", "date": "2026-05-30", "verification": "Recomputed", "related_kpi": "Cost Efficiency", "hash": "AUD-SIM-003", "data_class": DATA_CLASS},
        {"name": "Security_Assessment.pdf", "category": "Security", "type": "PDF", "uploader": "CISO", "date": "2026-05-30", "verification": "80% complete", "related_kpi": "Security", "hash": "AUD-SIM-004", "data_class": DATA_CLASS},
        {"name": "User_Feedback.pdf", "category": "User Feedback", "type": "PDF", "uploader": "Field Supervisor", "date": "2026-05-31", "verification": "Reviewed", "related_kpi": "User Satisfaction", "hash": "AUD-SIM-005", "data_class": DATA_CLASS},
    ]
    STATE["stage"] = "evidence"
    audit("KPI Updated", pilot_id, reason="Fast-forward populated final simulated KPI results")
    audit("Evidence Uploaded", pilot_id, reason="Demo evidence locker populated")
    return pilot


@app.post("/api/v1/procurement-readiness/{pilot_id}/calculate")
def calculate_readiness(pilot_id: str) -> dict:
    pilot = get_pilot(pilot_id)
    if not pilot.get("success"):
        raise HTTPException(status_code=409, detail="Mandatory KPI evidence is required before HIGH readiness.")
    pilot["readiness"] = readiness()
    STATE["stage"] = "readiness"
    audit("Readiness Calculated", pilot_id, reason="Procurement readiness calculated with visible security blocker")
    return pilot["readiness"]


@app.get("/api/v1/procurement-readiness/{pilot_id}")
def get_readiness(pilot_id: str) -> dict:
    pilot = get_pilot(pilot_id)
    return pilot.get("readiness") or readiness()


@app.get("/api/v1/pilots/{pilot_id}/score")
def get_score(pilot_id: str) -> dict:
    pilot = get_pilot(pilot_id)
    return pilot.get("success") or pilot_success()


@app.post("/api/v1/decisions")
def submit_decision(payload: DecisionRequest) -> dict:
    if not payload.reason.strip():
        raise HTTPException(status_code=422, detail="Decision reason is required.")
    decision = payload.model_dump()
    decision["status"] = "Human reviewer approved transition to procurement review." if payload.decision == "Proceed to Procurement Review" else payload.decision
    decision["data_class"] = DATA_CLASS
    STATE["decision"] = decision
    STATE["stage"] = "decision"
    audit("Human Decision Submitted", payload.pilot_id, actor=payload.officer_identity, reason=payload.reason)
    return decision


@app.post("/api/v1/export/handoff/{pilot_id}")
def generate_handoff(pilot_id: str) -> dict:
    if not STATE.get("decision"):
        raise HTTPException(status_code=409, detail="Human decision required before handoff.")
    handoff = build_handoff(problem_1042(), require_requirement(), require_recommendation(), readiness(), STATE["audit"])
    STATE["handoff"] = handoff
    STATE["stage"] = "handoff"
    audit("Handoff Generated", pilot_id, reason="Human-approved procurement review handoff generated")
    return handoff


@app.get("/api/v1/export/handoff/{pilot_id}")
def get_handoff(pilot_id: str) -> dict:
    if not STATE.get("handoff"):
        return generate_handoff(pilot_id)
    return STATE["handoff"]


@app.get("/api/v1/scale-recommendations/{solution_id}")
def scale_recommendations(solution_id: str) -> dict:
    return {
        "items": [
            {"id": "scale-mumbai", "department": "Mumbai Urban Development", "similarity": 91, "status": "PENDING DEPARTMENT CONSENT", "data_class": DATA_CLASS},
            {"id": "scale-nashik", "department": "Nashik Municipal", "similarity": 87, "status": "PENDING DEPARTMENT CONSENT", "data_class": DATA_CLASS},
            {"id": "scale-nagpur", "department": "Nagpur PWD", "similarity": 82, "status": "PENDING DEPARTMENT CONSENT", "data_class": DATA_CLASS},
        ],
        "reason": "Shared problem signature: urban roads + transit telemetry + computer vision + geospatial monitoring.",
        "data_class": DATA_CLASS,
    }


@app.post("/api/v1/scale-recommendations/{scale_id}/request-consent")
def request_consent(scale_id: str) -> dict:
    STATE["scale_consents"][scale_id] = "PENDING DEPARTMENT CONSENT"
    STATE["stage"] = "scale"
    audit("Scale Consent Requested", scale_id, reason="Scale requires department consent and is never automatic")
    return {"id": scale_id, "status": "PENDING DEPARTMENT CONSENT", "data_class": DATA_CLASS}


@app.get("/api/v1/audit/{entity_id}")
def audit_log(entity_id: str) -> dict:
    return {"label": "APPEND-ONLY AUDIT LOG", "items": STATE["audit"], "data_class": DATA_CLASS}


@app.post("/api/v1/demo/reset")
def demo_reset() -> dict:
    reset_state()
    return {"status": "reset", "state": STATE["stage"], "data_class": DATA_CLASS}


reset_state()
