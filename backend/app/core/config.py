from __future__ import annotations

from functools import lru_cache

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Phu My Hung Homes CRM"
    environment: str = "local"
    database_url: str = "postgresql+psycopg://pmh:pmh@db:5432/pmh_homes"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 8
    backend_cors_origins: list[AnyHttpUrl | str] = ["http://localhost:3000"]
    upload_storage_driver: str = "local"
    upload_dir: str = "uploads"
    upload_url_prefix: str = "/uploads"
    upload_public_base_url: str = "http://localhost:8000"
    upload_max_size_mb: int = 8

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
