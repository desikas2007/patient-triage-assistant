"""
Configuration module for Patient Intake Triage Assistant.
Reads environment variables safely and provides centralized configuration.
"""
import os
from pathlib import Path
from dotenv import load_dotenv


# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load local .env for development (no-op if missing; Render/Runtime env vars take precedence)
load_dotenv(BASE_DIR / ".env")

# Database
DATABASE_URL = f"sqlite:///{BASE_DIR / 'data' / 'triage.db'}"
DATABASE_PATH = BASE_DIR / "data" / "triage.db"

# Gemini API (secured via environment variable; never hardcode the key)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_EMBEDDING_MODEL = "gemini-embedding-001"

# Server
HOST = "0.0.0.0"
PORT = int(os.getenv("PORT", "8000"))  # Render sets PORT; local fallback is 8000

# Retrieval
EMBEDDINGS_DIR = BASE_DIR / "data" / "embeddings"
TRIAGE_RULES_JSON = BASE_DIR / "data" / "triage_rules.json"
TRIAGE_RULES_MD = BASE_DIR / "data" / "triage_rules.md"

# Frontend
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

# Triage categories
COMPLAINT_CATEGORIES = [
    "fever",
    "injury",
    "chest_pain",
    "breathing_difficulty",
    "abdominal_pain",
]

# Urgency levels
URGENCY_LEVELS = {
    1: "immediate",
    2: "urgent",
    3: "semi-urgent",
    4: "non-urgent",
    5: "no-show",
}
