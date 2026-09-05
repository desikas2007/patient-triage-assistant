"""
Pydantic models for Patient Intake Triage Assistant.
Defines request/response schemas for the API.
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


# Request Models
class PatientIntakeRequest(BaseModel):
    """Request model for patient intake text."""
    patient_text: str = Field(..., min_length=1, max_length=5000, 
                            description="Patient description in natural language")
    session_id: Optional[str] = Field(None, description="Optional session ID for continuity")


class FollowUpRequest(BaseModel):
    """Request model for follow-up answers."""
    session_id: str = Field(..., description="Session ID from initial intake")
    answers: List[str] = Field(..., description="Answers to follow-up questions")


class SessionResetRequest(BaseModel):
    """Request model for resetting a session."""
    session_id: Optional[str] = Field(None, description="Session ID to reset")


# Response Models
class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = "ok"
    version: str = "1.0.0"


class StructuredFacts(BaseModel):
    """Structured facts extracted from patient text."""
    complaint_category: Optional[str] = None
    reported_symptoms: List[str] = []
    reported_duration: Optional[str] = None
    reported_severity: Optional[str] = None
    reported_history: List[str] = []
    unknown_information: List[str] = []


class FollowUpQuestion(BaseModel):
    """A single follow-up question."""
    question_id: str
    question_text: str
    category: str  # e.g., "severity", "duration", "history"
    priority: str  # "high", "medium", "low"


class TriageRecommendation(BaseModel):
    """Triage recommendation result."""
    urgency_level: int = Field(..., ge=1, le=5)
    urgency_label: str
    department: str
    rule_id: Optional[str] = None
    rule_title: Optional[str] = None
    reasoning: str
    requires_human_review: bool = False
    escalation_reason: Optional[str] = None


class TriageResponse(BaseModel):
    """Response model for triage analysis."""
    session_id: str
    structured_facts: StructuredFacts
    follow_up_questions: List[FollowUpQuestion] = []
    recommendation: Optional[TriageRecommendation] = None
    requires_follow_up: bool = False
    status: str = "processing"  # "processing", "follow_up_needed", "completed"


class FollowUpResponse(BaseModel):
    """Response model for follow-up processing."""
    session_id: str
    updated_facts: StructuredFacts
    additional_questions: List[FollowUpQuestion] = []
    recommendation: Optional[TriageRecommendation] = None
    status: str = "processing"
