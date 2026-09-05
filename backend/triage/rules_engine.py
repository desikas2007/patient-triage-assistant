"""
Deterministic rules engine for triage decisions.
Separates medical decision-making from AI language understanding.
"""
import json
from pathlib import Path
from typing import Dict, List, Optional

from backend.config import TRIAGE_RULES_JSON
from backend.models import StructuredFacts, TriageRecommendation


class TriageRulesEngine:
    """
    Deterministic rules engine for triage decisions.
    
    This engine applies pre-defined rules to make triage recommendations.
    It does NOT use AI for decision-making - only for information extraction.
    """
    
    def __init__(self):
        """Initialize the rules engine and load rules."""
        self.rules: Dict[str, dict] = {}
        self._load_rules()
    
    def _load_rules(self) -> None:
        """Load triage rules from JSON file."""
        if TRIAGE_RULES_JSON.exists():
            with open(TRIAGE_RULES_JSON, "r") as f:
                data = json.load(f)
                for rule in data.get("rules", []):
                    rule_id = rule.get("rule_id")
                    if rule_id:
                        self.rules[rule_id] = rule
    
    def get_rule(self, rule_id: str) -> Optional[dict]:
        """Get a specific rule by ID."""
        return self.rules.get(rule_id)
    
    def get_rules_for_category(self, category: str) -> List[dict]:
        """Get all rules for a complaint category."""
        return [
            rule for rule in self.rules.values()
            if rule.get("complaint", "").lower() == category.lower()
        ]
    
    def evaluate(
        self, 
        facts: StructuredFacts,
        matched_rule_ids: Optional[List[str]] = None
    ) -> Optional[TriageRecommendation]:
        """
        Evaluate triage recommendation based on structured facts.
        
        This is a placeholder that will be implemented in the next phase.
        """
        # TODO: Implement deterministic rule evaluation
        # TODO: Apply red flag detection
        # TODO: Apply urgency scoring
        # TODO: Generate recommendation with rule citation
        raise NotImplementedError("Rules engine evaluation not yet implemented")
    
    def check_escalation(
        self,
        facts: StructuredFacts,
        recommendation: TriageRecommendation
    ) -> Optional[str]:
        """
        Check if case requires human escalation.
        
        Returns escalation reason if escalation is needed, None otherwise.
        """
        # TODO: Implement escalation logic
        # TODO: Check for uncertain cases
        # TODO: Check for high-risk indicators
        raise NotImplementedError("Escalation check not yet implemented")


# Singleton instance
_rules_engine: Optional[TriageRulesEngine] = None


def get_rules_engine() -> TriageRulesEngine:
    """Get or create the rules engine singleton."""
    global _rules_engine
    if _rules_engine is None:
        _rules_engine = TriageRulesEngine()
    return _rules_engine
