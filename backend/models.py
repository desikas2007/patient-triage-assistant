"""
Pydantic models for Patient Intake Triage Assistant.
Defines request/response schemas for the API.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


# ──────────────────────────────────────────────
# Request Models
# ──────────────────────────────────────────────

class PatientIntakeRequest(BaseModel):
    """Request model for patient intake text."""
    session_id: Optional[str] = Field(None, description="Optional session ID for continuity")
    message: str = Field(..., min_length=1, max_length=5000,
                         description="Patient description in natural language")


class FollowUpRequest(BaseModel):
    """Request model for follow-up answers."""
    session_id: str = Field(..., description="Session ID from initial intake")
    answers: Dict[str, str] = Field(...,
                                     description="Map of question_id to answer text")


class SessionResetRequest(BaseModel):
    """Request model for resetting a session."""
    session_id: Optional[str] = Field(None, description="Session ID to reset")


# ──────────────────────────────────────────────
# Response Models
# ──────────────────────────────────────────────

class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = "ok"


class FollowUpQuestion(BaseModel):
    """A single follow-up question."""
    question_id: str
    question_text: str
    category: str = "general"
    priority: str = "medium"


class TriageResult(BaseModel):
    """Complete triage response returned to the frontend."""
    status: str = Field(...,
                        description="complete | follow_up_required | human_review")
    session_id: str

    # Result fields (populated when status == complete)
    urgency: Optional[str] = None
    department: Optional[str] = None
    rule_ids: List[str] = Field(default_factory=list)
    reasoning: Optional[str] = None

    # Evidence separation
    reported: List[str] = Field(default_factory=list,
                                description="Patient-reported facts")
    established: List[str] = Field(default_factory=list,
                                   description="Facts from follow-up")
    unknown: List[str] = Field(default_factory=list,
                               description="Still-unknown information")

    # Follow-up questions (when status == follow_up_required)
    follow_up_questions: List[FollowUpQuestion] = Field(default_factory=list)

    # Escalation
    escalation: bool = False
    escalation_reason: Optional[str] = None
