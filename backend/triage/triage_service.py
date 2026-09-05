"""
Triage service for orchestrating the intake workflow.
Coordinates AI extraction, retrieval, and rules engine.
"""
import uuid
from typing import Optional

from backend.models import (
    PatientIntakeRequest,
    FollowUpRequest,
    TriageResponse,
    FollowUpResponse,
    StructuredFacts,
)
from backend.triage.rules_engine import get_rules_engine


class TriageService:
    """
    Main service for processing patient intake.
    
    Architecture:
    Patient text
        ↓
    Gemini (structured facts extraction)
        ↓
    Local retrieval (relevant rules)
        ↓
    Deterministic rules engine
        ↓
    Safety checks
        ↓
    Recommendation OR human escalation
    """
    
    def __init__(self):
        """Initialize the triage service."""
        self.rules_engine = get_rules_engine()
    
    async def process_intake(
        self, 
        request: PatientIntakeRequest
    ) -> TriageResponse:
        """
        Process a new patient intake.
        
        This is a placeholder that will be implemented in the next phase.
        """
        # Generate or use provided session ID
        session_id = request.session_id or str(uuid.uuid4())
        
        # TODO: Implement full workflow
        # 1. Extract structured facts using Gemini
        # 2. Retrieve relevant rules using embeddings
        # 3. Identify missing critical information
        # 4. If critical info missing, return follow-up questions
        # 5. Apply rules engine for recommendation
        # 6. Check for escalation conditions
        # 7. Return response
        
        return TriageResponse(
            session_id=session_id,
            structured_facts=StructuredFacts(),
            follow_up_questions=[],
            recommendation=None,
            requires_follow_up=True,
            status="processing",
        )
    
    async def process_follow_up(
        self, 
        request: FollowUpRequest
    ) -> FollowUpResponse:
        """
        Process follow-up answers and update assessment.
        
        This is a placeholder that will be implemented in the next phase.
        """
        # TODO: Implement follow-up processing
        # 1. Load existing session data
        # 2. Update structured facts with new answers
        # 3. Re-evaluate for missing information
        # 4. Apply rules engine if sufficient information
        # 5. Return updated response
        
        raise NotImplementedError("Follow-up processing not yet implemented")
    
    async def get_rule_explanation(self, rule_id: str) -> Optional[dict]:
        """Get explanation for a specific triage rule."""
        return self.rules_engine.get_rule(rule_id)
    
    def reset_session(self, session_id: str) -> None:
        """Reset a triage session."""
        # TODO: Implement session reset
        pass


# Singleton instance
_triage_service: Optional[TriageService] = None


def get_triage_service() -> TriageService:
    """Get or create the triage service singleton."""
    global _triage_service
    if _triage_service is None:
        _triage_service = TriageService()
    return _triage_service
