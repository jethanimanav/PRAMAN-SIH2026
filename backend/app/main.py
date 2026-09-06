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


# ── IMPLEMENTATION INTELLIGENCE ───────────────────────────────────────────────

@app.get("/api/v1/implementation/{project_id}")
def get_implementation(project_id: str) -> dict:
    impl = STATE.get("implementation")
    if not impl or impl.get("project_id") != project_id:
        raise HTTPException(status_code=404, detail="Implementation plan not found for this project.")
    return impl


@app.post("/api/v1/implementation/{project_id}")
def init_implementation(project_id: str) -> dict:
    impl = STATE.get("implementation")
    if not impl:
        raise HTTPException(status_code=404, detail="No implementation data seeded.")
    STATE["stage"] = "implementation"
    audit("Implementation Plan Initialized", project_id, reason="Implementation plan loaded from handoff data")
    return impl


class TaskUpdateRequest(BaseModel):
    status: str
    completion_pct: int | None = None
    notes: str | None = None


@app.patch("/api/v1/implementation/{project_id}/tasks/{task_id}")
def update_task(project_id: str, task_id: str, payload: TaskUpdateRequest) -> dict:
    impl = STATE.get("implementation")
    if not impl:
        raise HTTPException(status_code=404, detail="Implementation plan not found.")
    task = next((t for t in impl["tasks"] if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    task["status"] = payload.status
    if payload.completion_pct is not None:
        task["completion_pct"] = payload.completion_pct
    if payload.notes:
        task["notes"] = payload.notes
    audit(f"Task Updated: {task['name']}", task_id, reason=f"Status changed to {payload.status}")
    return task


@app.patch("/api/v1/implementation/{project_id}/tasks/{task_id}/resolve-blocker")
def resolve_blocker(project_id: str, task_id: str) -> dict:
    impl = STATE.get("implementation")
    if not impl:
        raise HTTPException(status_code=404, detail="Implementation plan not found.")
    # Find the blocked task and cascade resolution to dependents
    task = next((t for t in impl["tasks"] if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    task["status"] = "In Progress"
    task["completion_pct"] = 60
    task["notes"] = task["notes"] + " | BLOCKER RESOLVED: API access granted. Integration in progress."
    impl["blocker_resolved"] = True
    # Cascade: unblock dependent tasks
    cascade = []
    for t in impl["tasks"]:
        if task_id in t.get("depends_on", []) and t["status"] == "Blocked":
            t["status"] = "Not Started"
            cascade.append(t["id"])
    audit("Blocker Resolved", task_id, reason=f"Dependency resolved. Cascade unblocked: {cascade}")
    return {"task": task, "unblocked": cascade, "message": "Blocker resolved. Dependent tasks unblocked.", "data_class": DATA_CLASS}


@app.get("/api/v1/implementation/{project_id}/blockers")
def get_blockers(project_id: str) -> dict:
    impl = STATE.get("implementation")
    if not impl:
        return {"blockers": [], "data_class": DATA_CLASS}
    tasks = impl["tasks"]
    blocked = [t for t in tasks if t["status"] == "Blocked"]
    blocker_info = []
    for bt in blocked:
        deps = [t for t in tasks if t["id"] in bt.get("depends_on", []) and t["status"] == "Blocked"]
        blocker_info.append({
            "task_id": bt["id"],
            "task_name": bt["name"],
            "blocker_reason": bt["notes"],
            "responsible_owner": bt["owner"],
            "responsible_department": bt["department"],
            "affected_task_ids": [t["id"] for t in tasks if bt["id"] in t.get("depends_on", [])],
            "recommended_action": f"Resolve {bt['name']} before proceeding",
            "severity": bt["priority"],
            "data_class": DATA_CLASS,
        })
    return {"blockers": blocker_info, "total": len(blocker_info), "data_class": DATA_CLASS}


@app.get("/api/v1/implementation/{project_id}/responsibilities")
def get_responsibilities(project_id: str) -> dict:
    return {"items": STATE.get("responsibilities", []), "data_class": DATA_CLASS}


# ── MONITORING ────────────────────────────────────────────────────────────────

@app.get("/api/v1/monitoring/{project_id}")
def get_monitoring(project_id: str) -> dict:
    return {"items": STATE.get("monitoring", []), "data_class": DATA_CLASS}


class MonitoringRecordRequest(BaseModel):
    month: str
    period: str
    accuracy_pct: float
    uptime_pct: float
    cost_lakh: float
    issues_count: int
    notes: str = ""


@app.post("/api/v1/monitoring/{project_id}")
def add_monitoring_record(project_id: str, payload: MonitoringRecordRequest) -> dict:
    from uuid import uuid4
    record = {
        "id": str(uuid4()),
        "month": payload.month,
        "period": payload.period,
        "accuracy_pct": payload.accuracy_pct,
        "uptime_pct": payload.uptime_pct,
        "cost_lakh": payload.cost_lakh,
        "issues_count": payload.issues_count,
        "kpis": [],
        "notes": payload.notes,
        "evidence_ref": f"EVID-MON-{payload.period.replace(' ', '-')}",
        "data_class": DATA_CLASS,
    }
    STATE["monitoring"].append(record)
    audit("Monitoring Record Added", project_id, reason=f"Monthly record for {payload.period}")
    return record


# ── OUTCOMES ──────────────────────────────────────────────────────────────────

@app.get("/api/v1/outcomes/{project_id}")
def get_outcome(project_id: str) -> dict:
    outcome = STATE.get("outcome")
    if not outcome:
        raise HTTPException(status_code=404, detail="No outcome recorded yet.")
    return outcome


class OutcomeRequest(BaseModel):
    result: str
    reason: str
    related_evidence: str = ""
    related_dependency: str = ""


@app.post("/api/v1/outcomes/{project_id}")
def submit_outcome(project_id: str, payload: OutcomeRequest) -> dict:
    STATE["outcome"]["result"] = payload.result
    STATE["outcome"]["reason"] = payload.reason
    if payload.related_evidence:
        STATE["outcome"]["related_evidence"] = payload.related_evidence
    audit("Outcome Recorded", project_id, reason=f"Result: {payload.result}")
    return STATE["outcome"]


# ── LESSONS LEARNED ───────────────────────────────────────────────────────────

@app.get("/api/v1/lessons/{project_id}")
def get_lessons(project_id: str) -> dict:
    return {"items": STATE.get("lessons", []), "data_class": DATA_CLASS}


class LessonRequest(BaseModel):
    category: str
    lesson: str
    what_worked: str = ""
    what_failed: str = ""
    recommendation: str = ""
    reuse_recommended: bool = False


@app.post("/api/v1/lessons/{project_id}")
def add_lesson(project_id: str, payload: LessonRequest) -> dict:
    from uuid import uuid4
    lesson = {
        "id": str(uuid4()),
        "project_id": project_id,
        "category": payload.category,
        "lesson": payload.lesson,
        "what_worked": payload.what_worked,
        "what_failed": payload.what_failed,
        "delay_cause": "",
        "dependency_issue": "",
        "recommendation": payload.recommendation,
        "reuse_recommended": payload.reuse_recommended,
        "startup_recommended": True,
        "evidence_ref": "",
        "outcome_ref": f"outcome-{project_id}",
        "risk_ref": "",
        "data_class": DATA_CLASS,
    }
    STATE["lessons"].append(lesson)
    audit("Lesson Learned Recorded", project_id, reason=f"Category: {payload.category}")
    return lesson


# ── INSTITUTIONAL MEMORY ──────────────────────────────────────────────────────

@app.get("/api/v1/institutional-memory")
def list_institutional_memory() -> dict:
    return {"items": STATE.get("institutional_memory", []), "total": len(STATE.get("institutional_memory", [])), "data_class": DATA_CLASS}


@app.get("/api/v1/institutional-memory/search")
def search_institutional_memory(q: str = "") -> dict:
    records = STATE.get("institutional_memory", [])
    if not q.strip():
        return {"items": records, "query": q, "data_class": DATA_CLASS}
    q_lower = q.lower()
    results = [
        r for r in records
        if q_lower in r["problem"].lower()
        or q_lower in r["domain"].lower()
        or q_lower in r["technology"].lower()
        or q_lower in r["city"].lower()
        or any(q_lower in sig for sig in r.get("similarity_signature", []))
    ]
    failed_match = any(r["outcome"] == "Failed" for r in results)
    return {
        "items": results,
        "query": q,
        "total": len(results),
        "has_failed_match": failed_match,
        "data_class": DATA_CLASS,
    }


# ── REUSE INTELLIGENCE ────────────────────────────────────────────────────────

@app.get("/api/v1/reuse-recommendations")
def get_reuse_recommendations(problem_id: str = "1042") -> dict:
    best = next((r for r in STATE.get("institutional_memory", []) if r["outcome"] == "Successful"), None)
    if not best:
        return {"items": [], "data_class": DATA_CLASS}
    recommendation = {
        "id": "reuse-001",
        "similarity_pct": 87,
        "previous_project_id": best["id"],
        "previous_city": best["city"],
        "previous_year": best["year"],
        "startup": best["startup"],
        "startup_id": best["startup_id"],
        "previous_pilot_score": best["pilot_score"],
        "production_outcome_pct": best["actual_accuracy_pct"],
        "implementation_days": best["implementation_days"],
        "reuse_confidence_pct": 88,
        "recommendation": "REUSE EXISTING SOLUTION",
        "reason": f"Problem #1042 shares 87% structural similarity with the {best['city']} {best['year']} project. {best['startup']} achieved {best['actual_accuracy_pct']}% accuracy in production — exceeding targets. Reuse eliminates procurement risk and reduces implementation time.",
        "known_risks": best["known_risks"],
        "known_dependencies": best["known_dependencies"],
        "data_class": DATA_CLASS,
    }
    return {"items": [recommendation], "data_class": DATA_CLASS}


# ── RISK RADAR ────────────────────────────────────────────────────────────────

@app.get("/api/v1/risk-radar/{project_id}")
def get_risk_radar(project_id: str) -> dict:
    return {"items": STATE.get("risk_radar", []), "data_class": DATA_CLASS}


# ── DECISION REPLAY ───────────────────────────────────────────────────────────

@app.get("/api/v1/decision-replay/{decision_id}")
def get_decision_replay(decision_id: str) -> dict:
    replay = STATE.get("decision_replay")
    if not replay:
        raise HTTPException(status_code=404, detail="No decision replay data found.")
    return replay


# ── MODEL VERSIONS ────────────────────────────────────────────────────────────

@app.get("/api/v1/model-versions")
def get_model_versions() -> dict:
    return {"items": STATE.get("model_versions", []), "data_class": DATA_CLASS}


reset_state()

