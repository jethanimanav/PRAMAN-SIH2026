from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_name: str = "PRAMAN"
    api_prefix: str = "/api/v1"
    jwt_secret: str = os.getenv("JWT_SECRET", "praman-local-demo-secret")
    engine_label: str = os.getenv("DEMO_ENGINE", "LOCAL DEMO ENGINE")
    model_version: str = "praman-deterministic-v1"
    data_class: str = "SIMULATED"


settings = Settings()
