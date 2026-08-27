from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "PRAMAN"
    api_prefix: str = "/api/v1"
    jwt_secret: str = "praman-local-demo-secret"
    engine_label: str = "LOCAL DEMO ENGINE"
    model_version: str = "praman-deterministic-v1"
    data_class: str = "SIMULATED"


settings = Settings()
