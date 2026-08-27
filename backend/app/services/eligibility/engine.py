CHECKS = [
    ("ELG-001", "DPIIT", "PASS", "SIMULATED VERIFIED"),
    ("ELG-004", "Certificate", "PASS", "Certificate metadata present"),
    ("ELG-008", "Document completeness", "PASS", "Mandatory documents available"),
    ("ELG-011", "Blacklist/debarment", "PASS", "No simulated debarment flag"),
    ("ELG-014", "Deployment willingness", "PASS", "Pune bus-fleet deployment accepted"),
]


def run_eligibility(startup: dict, problem: dict) -> dict:
    return {
        "startup_id": startup["id"],
        "problem_id": problem["id"],
        "status": "PASS",
        "checks": [
            {"code": code, "name": name, "status": status, "reason": reason, "data_class": "SIMULATED"}
            for code, name, status, reason in CHECKS
        ],
        "note": "INCOMPLETE is not treated as FAIL in PRAMAN.",
        "data_class": "SIMULATED",
    }
