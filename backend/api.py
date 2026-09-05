"""
FastAPI routes for Patient Intake Triage Assistant.
"""
import uuid
from fastapi import APIRouter, HTTPException

from backend.models import (
    HealthResponse,
    PatientIntakeRequest,
    FollowUpRequest,
    SessionResetRequest,
    TriageResult,
)
from backend.triage.triage_service import get_triage_service

router = APIRouter(prefix="/api")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse()


@router.post("/triage")
async def process_triage(request: PatientIntakeRequest):
    """Process patient intake text."""
    service = get_triage_service()
    try:
        result = await service.process_intake(request)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/follow-up")
async def process_follow_up(request: FollowUpRequest):
    """Process follow-up answers."""
    service = get_triage_service()
    try:
        result = await service.process_follow_up(request)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rules/{rule_id}")
async def get_rule(rule_id: str):
    """Get a specific triage rule by ID."""
    service = get_triage_service()
    rule = await service.get_rule_explanation(rule_id)
    if rule is None:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule


@router.post("/session/reset")
async def reset_session(request: SessionResetRequest):
    """Reset a triage session."""
    service = get_triage_service()
    session_id = request.session_id or str(uuid.uuid4())
    service.reset_session(session_id)
    return {"status": "ok", "session_id": session_id}
