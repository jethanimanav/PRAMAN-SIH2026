from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from uuid import uuid4

DATA_CLASS = "SIMULATED"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


BASE_STATE = {
    "stage": "intake",
    "decision": None,
    "handoff": None,
    "scale_consents": {},
    "users": [
        {
            "id": "usr-officer",
            "name": "Ananya Deshmukh",
            "email": "officer@praman.local",
            "password": "demo123",
            "role": "officer",
            "mfa": "123456",
            "department": "Urban Development / PWD",
            "data_class": DATA_CLASS,
        },
        {"id": "usr-evaluator", "name": "Pilot Evaluator", "email": "evaluator@praman.local", "password": "demo123", "role": "evaluator", "mfa": "123456", "data_class": DATA_CLASS},
        {"id": "usr-startup", "name": "SkylineAI Portal", "email": "startup@praman.local", "password": "demo123", "role": "startup", "mfa": "123456", "data_class": DATA_CLASS},
        {"id": "usr-admin", "name": "MSInS Admin", "email": "admin@praman.local", "password": "demo123", "role": "msins_admin", "mfa": "123456", "data_class": DATA_CLASS},
        {"id": "usr-auditor", "name": "Audit Officer", "email": "auditor@praman.local", "password": "demo123", "role": "auditor", "mfa": "123456", "data_class": DATA_CLASS},
        {"id": "usr-ciso", "name": "Security Reviewer", "email": "ciso@praman.local", "password": "demo123", "role": "ciso", "mfa": "123456", "data_class": DATA_CLASS},
    ],
    "departments": [
        {"id": "dept-pune", "name": "Urban Development / PWD", "location": "Pune", "data_class": DATA_CLASS},
        {"id": "dept-mumbai", "name": "Mumbai Urban Development", "location": "Mumbai", "data_class": DATA_CLASS},
        {"id": "dept-nashik", "name": "Nashik Municipal", "location": "Nashik", "data_class": DATA_CLASS},
        {"id": "dept-nagpur", "name": "Nagpur PWD", "location": "Nagpur", "data_class": DATA_CLASS},
    ],
    "problems": [
        {
            "id": "1042",
            "display_id": "#1042",
            "department": "Urban Development / PWD",
            "location": "Pune Municipal Bus Fleet",
            "title": "AI Road Damage Detection for Public Transport Routes",
            "narrative": "Need an AI-powered solution to detect road damage using public transport. The department needs road-condition insights from municipal bus routes, geotagged alerts for field teams, and reliable operation in varying lighting conditions. The pilot must be completed within 90 days and remain within the approved innovation budget.",
            "budget": "₹50L – ₹1Cr",
            "timeline_days": 90,
            "core_kpi": "Road-damage detection recall ≥ 90%",
            "constraint": "Night-time false positives",
            "domain": "Urban Infrastructure",
            "technology": "Computer Vision",
            "supporting": ["GPS", "Geospatial Analytics", "Edge / On-device inference"],
            "deployment": "Municipal bus fleet + field inspection workflow",
            "security": "Security questionnaire + deployment review required.",
            "status": "Draft",
            "data_class": DATA_CLASS,
        }
    ],
    "requirements": {},
    "startups": [
        {
            "id": "startup-skyline",
            "name": "SkylineAI Solutions",
            "dpiit": "SIMULATED VERIFIED",
            "capabilities": ["Computer Vision", "GPS", "Edge deployment", "Geospatial outputs", "ITS pilot evidence"],
            "location_readiness": ["Pune", "Maharashtra"],
            "budget_band": "₹50L – ₹1Cr",
            "eligibility": "PASS",
            "score": 93,
            "data_class": DATA_CLASS,
        },
        {"id": "startup-aeroscan", "name": "AeroScan Tech", "dpiit": "SIMULATED VERIFIED", "capabilities": ["Drone analytics", "Geospatial capability"], "eligibility": "PASS", "score": 87, "data_class": DATA_CLASS},
        {"id": "startup-urbansentry", "name": "UrbanSentry", "dpiit": "SIMULATED VERIFIED", "capabilities": ["Road monitoring", "Municipal workflow"], "eligibility": "PASS", "score": 82, "data_class": DATA_CLASS},
    ],
    "recommendations": [],
    "pilots": {},
    "evidence": [],
    "audit": [],
}

STATE = deepcopy(BASE_STATE)


def audit(action: str, entity: str, actor: str = "Ananya Deshmukh", role: str = "officer", reason: str = "Demo workflow action") -> dict:
    event = {
        "id": str(uuid4()),
        "timestamp": now(),
        "actor": actor,
        "role": role,
        "action": action,
        "entity": entity,
        "reason": reason,
        "system_version": "praman-deterministic-v1",
        "data_class": DATA_CLASS,
    }
    STATE["audit"].append(event)
    return event


def reset_state() -> dict:
    STATE.clear()
    STATE.update(deepcopy(BASE_STATE))
    audit("Problem Created", "Problem #1042", reason="Hero demo reset loaded simulated problem")
    return STATE
