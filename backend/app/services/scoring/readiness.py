PILOT_KPIS = [
    {"name": "Detection Recall", "baseline": "Manual visual road survey", "target": "≥90%", "actual": "94.2%", "verifier": "Pilot Evaluator", "data_class": "SIMULATED"},
    {"name": "Cost Efficiency", "baseline": "Manual visual road survey", "target": "−20%", "actual": "−27%", "verifier": "Finance Reviewer", "data_class": "SIMULATED"},
    {"name": "Reliability", "baseline": "Manual visual road survey", "target": "≥95%", "actual": "96%", "verifier": "Operations Lead", "data_class": "SIMULATED"},
    {"name": "False Positive Rate", "baseline": "Night-time issue reports", "target": "<15%", "actual": "10%", "verifier": "Field Team", "data_class": "SIMULATED"},
]

PILOT_SUCCESS = {
    "Technical Performance": 92,
    "User Satisfaction": 88,
    "Cost Efficiency": 91,
    "Reliability": 96,
    "Scalability Evidence": 84,
}

READINESS = {
    "Pilot Success": 91,
    "Evidence Completeness": 85,
    "Security": 80,
    "Reliability": 96,
    "Cost": 91,
    "UX / Field Adoption": 88,
    "Scalability": 84,
    "Documentation": 90,
    "Compliance": 86,
    "Operations": 87,
}


def pilot_success() -> dict:
    return {
        "dimensions": PILOT_SUCCESS,
        "overall": 91,
        "status": "SUCCESSFUL",
        "method": "Transparent TOPSIS-style weighted decision support, not an ML prediction.",
        "topsis": {
            "criteria": list(PILOT_SUCCESS.keys()),
            "weights": [0.25, 0.2, 0.2, 0.2, 0.15],
            "normalization": "Vector normalization over simulated KPI dimensions",
            "ideal_solution": "Best observed target attainment",
            "anti_ideal_solution": "Minimum acceptable target attainment",
            "distance": "Closeness coefficient mapped to 91/100",
        },
        "data_class": "SIMULATED",
    }


def readiness() -> dict:
    return {
        "score": 91,
        "band": "HIGH READINESS",
        "dimensions": READINESS,
        "blocker": "Security questionnaire 80% complete.",
        "suggested_action": "Complete the security questionnaire before procurement review.",
        "disclaimer": "Decision support only — final procurement remains with authorized government officials.",
        "data_class": "SIMULATED",
    }
