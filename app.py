"""
Patient Intake Triage Assistant - Main Entry Point
Run: python app.py
"""
import os
import sys
import logging
import uvicorn
from pathlib import Path

# Ensure the project root is on the path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from backend.config import HOST, PORT, FRONTEND_DIST
from backend.database import init_database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("triage")

# Create FastAPI application
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(
    title="Patient Intake Triage Assistant",
    description="AI-assisted patient intake routing",
    version="1.0.0",
)

# Import and register API routes AFTER app creation to avoid circular imports
from backend.api import router
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Initialize database, load rules, and build index on startup."""
    logger.info("Starting Patient Intake Triage Assistant...")

    # 1. Initialize SQLite
    init_database()
    logger.info("Database initialized")

    # 2. Load rules (happens in rules_engine init)
    from backend.triage.rules_engine import get_rules_engine
    engine = get_rules_engine()
    logger.info(f"Loaded {len(engine.rules)} triage rules")

    # 3. Try to load cached retrieval index (cheap operation)
    from backend.retrieval.retriever import get_retriever
    retriever = get_retriever()
    try:
        retriever.index.load()
        logger.info("Loaded cached retrieval index")
    except Exception:
        logger.info("No cached index — will build on first query if API key available")

    # 4. Check Gemini availability
    from backend.config import GEMINI_API_KEY
    if GEMINI_API_KEY:
        logger.info("Gemini API key configured")
    else:
        logger.warning("GEMINI_API_KEY not set — using rule-based fallbacks only")

    logger.info("Application ready!")


# Serve frontend static files
if FRONTEND_DIST.exists():
    # Mount assets directory
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend files with SPA fallback."""
        # Make sure API routes are NOT caught by this catch-all
        if full_path.startswith("api/"):
            from fastapi import Request
            from starlette.exceptions import HTTPException as StarletteHTTPException
            raise StarletteHTTPException(status_code=404)

        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_DIST / "index.html"))
else:
    @app.get("/")
    async def root():
        return {
            "message": "Patient Intake Triage Assistant API",
            "docs": "/docs",
            "health": "/api/health",
        }


if __name__ == "__main__":
    print(f"\n{'='*60}")
    print(f"  Patient Intake Triage Assistant")
    print(f"  Starting on http://{HOST}:{PORT}")
    print(f"{'='*60}\n")
    uvicorn.run(
        "app:app",
        host=HOST,
        port=PORT,
        reload=False,
        log_level="info",
    )
