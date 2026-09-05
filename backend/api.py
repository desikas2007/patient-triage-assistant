"""
FastAPI application for Patient Intake Triage Assistant.
Defines all API endpoints.
"""
from fastapi import APIRouter, HTTPException

from backend.models import (
    HealthResponse,
    PatientIntakeRequest,
    FollowUpRequest,
    SessionResetRequest,
    TriageResponse,
    FollowUpResponse,
)
from backend.triage.triage_service import get_triage_service


# Create API router
router = APIRouter(prefix="/api")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse()


@router.post("/triage", response_model=TriageResponse)
async def process_triage(request: PatientIntakeRequest):
    """
    Process patient intake text for triage.
    
    This is a placeholder that will be implemented in the next phase.
    """
    service = get_triage_service()
    
    try:
        response = await service.process_intake(request)
        return response
    except NotImplementedError:
        # Return a placeholder response during initialization
        from backend.models import StructuredFacts
        return TriageResponse(
            session_id="placeholder-session",
            structured_facts=StructuredFacts(),
            follow_up_questions=[],
            recommendation=None,
            requires_follow_up=True,
            status="placeholder",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/follow-up", response_model=FollowUpResponse)
async def process_follow_up(request: FollowUpRequest):
    """
    Process follow-up answers and update triage assessment.
    
    This is a placeholder that will be implemented in the next phase.
    """
    service = get_triage_service()
    
    try:
        response = await service.process_follow_up(request)
        return response
    except NotImplementedError:
        # Return a placeholder response during initialization
        from backend.models import StructuredFacts
        return FollowUpResponse(
            session_id=request.session_id,
            updated_facts=StructuredFacts(),
            additional_questions=[],
            recommendation=None,
            status="placeholder",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rules/{rule_id}")
async def get_rule(rule_id: str):
    """
    Get a specific triage rule by ID.
    
    This is a placeholder that will be implemented in the next phase.
    """
    service = get_triage_service()
    
    try:
        rule = await service.get_rule_explanation(rule_id)
        if rule is None:
            raise HTTPException(status_code=404, detail="Rule not found")
        return rule
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/session/reset")
async def reset_session(request: SessionResetRequest):
    """
    Reset a triage session.
    
    This is a placeholder that will be implemented in the next phase.
    """
    service = get_triage_service()
    
    try:
        session_id = request.session_id or "new-session"
        service.reset_session(session_id)
        return {"status": "ok", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
