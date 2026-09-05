"""
Patient Intake Triage Assistant - Main Entry Point
Run this file to start the application: python app.py
"""
import uvicorn
from pathlib import Path

from backend.config import HOST, PORT, FRONTEND_DIST
from backend.api import router
from backend.database import init_database

# Import FastAPI
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Create FastAPI application
app = FastAPI(
    title="Patient Intake Triage Assistant",
    description="AI-assisted patient intake routing",
    version="1.0.0",
)

# Include API router
app.include_router(router)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database and other services on startup."""
    init_database()
    print("Database initialized successfully")

# Mount static files for frontend (if built)
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend files, falling back to index.html for SPA routing."""
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")


if __name__ == "__main__":
    print(f"Starting Patient Intake Triage Assistant on http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop")
    uvicorn.run(
        "app:app",
        host=HOST,
        port=PORT,
        reload=False,  # Disable reload for production
        log_level="info",
    )
