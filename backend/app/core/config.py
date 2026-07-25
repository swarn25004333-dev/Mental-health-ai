from pathlib import Path
import os
from pydantic_settings import BaseSettings

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mental Health AI"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # Security & JWT
    JWT_SECRET_KEY: str = "default_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Supabase Credentials
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Google Gemini AI Key & Model
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL_NAME: str = "gemini-flash-latest"

    # --------------------------------------------------------
    # Rate Limiting (slowapi) — configurable via .env
    # Format: "<count>/<period>" e.g. "5/minute", "20/hour"
    # --------------------------------------------------------
    # POST /chatbot/chat — per client IP (burst protection)
    RATE_LIMIT_CHAT_IP: str = "5/minute"
    # POST /chatbot/chat — per authenticated user (fair-use quota)
    RATE_LIMIT_CHAT_USER: str = "20/hour"
    # POST /auth/login — per IP (brute-force protection)
    RATE_LIMIT_LOGIN_IP: str = "5/minute"
    # POST /auth/signup — per IP (account farming protection)
    RATE_LIMIT_SIGNUP_IP: str = "3/10 minutes"

    class Config:
        env_file = str(ENV_PATH) if ENV_PATH.exists() else ".env"
        extra = "ignore"

settings = Settings()

