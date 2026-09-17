from __future__ import annotations

from app.services.eligibility.engine import run_eligibility

WEIGHTS = {
    "problem_semantic_fit": 0.25,
    "technology_fit": 0.20,
    "eligibility": 0.15,
    "deployment_geography": 0.15,
    "pilot_capacity": 0.10,
    "budget": 0.10,
    "prior_similar_evidence": 0.05,
}

DIMENSIONS = {
    "startup-skyline": {
        "Problem Fit": 93,
        "Technology Fit": 96,
        "Eligibility": 100,
        "Deployment Readiness": 88,
        "Pilot Capacity": 89,
        "Budget Fit": 91,
        "Prior Similar Evidence": 82,
    },
    "startup-aeroscan": {
        "Problem Fit": 86,
        "Technology Fit": 89,
        "Eligibility": 100,
        "Deployment Readiness": 76,
        "Pilot Capacity": 84,
        "Budget Fit": 89,
        "Prior Similar Evidence": 79,
    },
    "startup-urbansentry": {
        "Problem Fit": 84,
        "Technology Fit": 82,
        "Eligibility": 100,
        "Deployment Readiness": 80,
        "Pilot Capacity": 78,
        "Budget Fit": 74,
        "Prior Similar Evidence": 75,
    },
}


def bm25_rank(startups: list[dict], problem: dict) -> list[str]:
    terms = set((problem["narrative"] + " " + problem["technology"] + " " + " ".join(problem["supporting"])).lower().replace("/", " ").split())
    scored = []
    for startup in startups:
        text = " ".join(startup.get("capabilities", [])).lower().replace("/", " ")
        score = sum(1 for term in terms if term in text)
        scored.append((startup["id"], score))
    return [sid for sid, _ in sorted(scored, key=lambda item: item[1], reverse=True)]


def dense_rank(startups: list[dict]) -> list[str]:
    return sorted([s["id"] for s in startups], key=lambda sid: DIMENSIONS[sid]["Technology Fit"], reverse=True)


def rrf(*rankings: list[str], k: int = 60) -> list[str]:
    scores: dict[str, float] = {}
    for ranking in rankings:
        for index, item in enumerate(ranking):
            scores[item] = scores.get(item, 0) + 1 / (k + index + 1)
    return [sid for sid, _ in sorted(scores.items(), key=lambda item: item[1], reverse=True)]


def topsis_score(dimensions: dict[str, int]) -> int:
    weighted = (
        dimensions["Problem Fit"] * WEIGHTS["problem_semantic_fit"]
        + dimensions["Technology Fit"] * WEIGHTS["technology_fit"]
        + dimensions["Eligibility"] * WEIGHTS["eligibility"]
        + dimensions["Deployment Readiness"] * WEIGHTS["deployment_geography"]
        + dimensions["Pilot Capacity"] * WEIGHTS["pilot_capacity"]
        + dimensions["Budget Fit"] * WEIGHTS["budget"]
        + dimensions["Prior Similar Evidence"] * WEIGHTS["prior_similar_evidence"]
    )
    return round(weighted)


def match(problem: dict, startups: list[dict]) -> dict:
    bm25 = bm25_rank(startups, problem)
    dense = dense_rank(startups)
    fused = rrf(bm25, dense)
    by_id = {startup["id"]: startup for startup in startups}
    results = []
    for sid in fused:
        startup = by_id[sid]
        dimensions = DIMENSIONS[sid]
        eligibility = run_eligibility(startup, problem)
        score = topsis_score(dimensions)
        results.append(
            {
                "id": f"rec-{sid}",
                "startup": startup,
                "score": score,
                "band": "HIGH MATCH" if score >= 90 else "GOOD MATCH",
                "eligibility": eligibility,
                "dimensions": dimensions,
                "why": startup["capabilities"],
                "pipeline": {
                    "discovered": 124,
                    "eligible": 36,
                    "capability_matches": 12,
                    "recommended": 3,
                    "bm25_rank": bm25,
                    "dense_rank": dense,
                    "rrf_rank": fused,
                    "method": "BM25 + deterministic dense interface + RRF + TOPSIS",
                    "model_version": "praman-deterministic-v1",
                    "engine": "LOCAL DEMO ENGINE",
                    "data_class": "SIMULATED",
                },
                "data_class": "SIMULATED",
            }
        )
    
    results.sort(key=lambda x: x["score"], reverse=True)
    for index, res in enumerate(results, start=1):
        res["rank"] = index
        
    return {"weights": WEIGHTS, "results": results, "data_class": "SIMULATED"}
