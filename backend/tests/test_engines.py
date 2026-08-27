from app.services.demo.store import reset_state, STATE
from app.services.matching.engine import match, rrf
from app.services.scoring.readiness import readiness, pilot_success


def test_rrf_keeps_skyline_first():
    assert rrf(["startup-skyline", "startup-aeroscan"], ["startup-skyline", "startup-urbansentry"])[0] == "startup-skyline"


def test_matching_skyline_number_one():
    reset_state()
    result = match(STATE["problems"][0], STATE["startups"])
    assert result["results"][0]["startup"]["name"] == "SkylineAI Solutions"
    assert result["results"][0]["score"] == 93
    assert result["results"][0]["data_class"] == "SIMULATED"


def test_readiness_is_91_with_security_blocker():
    score = readiness()
    assert score["score"] == 91
    assert score["band"] == "HIGH READINESS"
    assert "80% complete" in score["blocker"]


def test_pilot_success_is_not_ml_prediction():
    score = pilot_success()
    assert score["overall"] == 91
    assert "not an ML prediction" in score["method"]
