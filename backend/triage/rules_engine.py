"""
Deterministic rules engine for triage decisions.
Separates medical decision-making from AI language understanding.
This is the FINAL decision authority.
"""
import json
import re
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from backend.config import TRIAGE_RULES_JSON

logger = logging.getLogger(__name__)

# Urgency hierarchy (lower number = higher urgency)
URGENCY_RANK = {
    "immediate": 1,
    "urgent": 2,
    "semi-urgent": 3,
    "non-urgent": 4,
    None: 99,
}

# Synonym groups for more flexible medical text matching
SYNONYM_GROUPS = {
    "radiation": ["radiat", "spread", "travel", "extend", "shoot"],
    "dyspnea": ["shortness", "breathless", "difficulty breathing",
                  "breathing difficulty", "can't breathe", "trouble breathing",
                  "dyspnea", "hard to breathe", "out of breath"],
    "diaphoresis": ["sweat", "diaphoresi", "perspir", "clammy", "drench"],
    "nausea": ["nausea", "nauseous", "queasy", "vomit", "throw up",
                "sick to stomach"],
    "chest_pain": ["chest pain", "chest discomfort", "chest tightness",
                    "chest pressure", "chest ache"],
}


# Critical symptom combinations that require human review
# Each entry: (pattern_name, list_of_keyword_groups, min_groups_needed, reason)
CRITICAL_COMBINATIONS = [
    (
        "chest_pain_with_red_flags",
        {
            "chest_pain": ["chest pain", "chest discomfort", "chest tightness",
                           "chest pressure"],
            "radiation": ["spread", "spreading", "radiat", "to arm", "to jaw",
                          "left arm", "right arm", "arm", "jaw", "back",
                          "shoulder"],
            "dyspnea": ["breath", "shortness", "breathing difficulty",
                        "difficulty breathing", "can't breathe", "trouble breathing",
                        "out of breath"],
            "autonomic": ["sweat", "diaphoresis", "nausea", "vomit",
                          "dizzy", "lightheaded", "clammy"],
        },
        2,
        "Chest pain with reported red-flag features (radiation, dyspnea, or autonomic symptoms) requires urgent evaluation and human review.",
    ),
    (
        "respiratory_distress",
        {
            "severe_breathlessness": ["can't breathe", "unable to breathe",
                                       "gasping", "choking"],
            "cyanosis": ["blue lips", "blue fingernails", "turning blue",
                         "cyanosis"],
        },
        2,
        "Severe respiratory distress with multiple concerning features requires immediate human review.",
    ),
]


class TriageRulesEngine:
    """
    Deterministic rules engine for triage decisions.

    Gemini is used for language understanding.
    This engine makes the FINAL routing decision based on structured facts
    and local triage rules.
    """

    def __init__(self):
        self.rules: Dict[str, dict] = {}
        self._load_rules()

    def _load_rules(self) -> None:
        if TRIAGE_RULES_JSON.exists():
            with open(TRIAGE_RULES_JSON, "r") as f:
                data = json.load(f)
                for rule in data.get("rules", []):
                    rule_id = rule.get("rule_id")
                    if rule_id:
                        self.rules[rule_id] = rule
        logger.info(f"Loaded {len(self.rules)} triage rules")

    def get_rule(self, rule_id: str) -> Optional[dict]:
        return self.rules.get(rule_id)

    def get_rules_for_category(self, category: str) -> List[dict]:
        return [
            rule for rule in self.rules.values()
            if rule.get("complaint", "").lower() == category.lower()
        ]

    # ── Temperature extraction ──────────────────────

    def _extract_temperature(self, text: str) -> Optional[float]:
        """
        Extract temperature value in Fahrenheit from text.
        Returns float or None if no temperature found.
        """
        text_lower = text.lower()
        # Pattern: number followed by optional degree symbol and F/C
        patterns = [
            r"(\d+\.?\d*)\s*°?\s*f",
            r"(\d+\.?\d*)\s*°?\s*c",
            r"temperature\s+(?:of\s+)?(\d+\.?\d*)",
            r"fever\s+(?:of\s+)?(\d+\.?\d*)",
        ]
        for pattern in patterns:
            match = re.search(pattern, text_lower)
            if match:
                try:
                    value = float(match.group(1))
                    # Convert Celsius to Fahrenheit if needed
                    if "c" in pattern and "f" not in pattern:
                        # Check if the match includes 'c' after the number
                        full_match = match.group(0)
                        if full_match.rstrip().endswith("c") or "°c" in full_match:
                            value = value * 9 / 5 + 32
                    return value
                except (ValueError, IndexError):
                    continue
        return None

    # ── Rule applicability checking ─────────────────

    def _check_rule_applicability(
        self,
        rule: dict,
        facts: dict,
        has_red_flags: bool,
        temperature: Optional[float],
    ) -> bool:
        """
        Check if a rule's applicability conditions are satisfied by the facts.
        Returns True if the rule applies, False otherwise.
        """
        applicability = rule.get("applicability", {})

        # If no applicability defined, rule is always eligible
        if not applicability:
            return True

        # Always-apply rules (e.g., GEN-003 for unsupported categories)
        if applicability.get("always_apply"):
            return True

        # Insufficient info rules (urgency=null fallback rules)
        if applicability.get("insufficient_info"):
            # These rules apply when critical info is missing
            # They are fallback rules, not primary candidates
            return True

        # Temperature-based conditions
        temp_below = applicability.get("temperature_below")
        temp_above = applicability.get("temperature_above")
        temp_range = applicability.get("temperature_range")

        if temp_below is not None:
            if temperature is None or temperature >= temp_below:
                return False

        if temp_above is not None:
            if temperature is None or temperature <= temp_above:
                return False

        if temp_range is not None:
            min_temp, max_temp = temp_range
            if temperature is None or temperature < min_temp or temperature >= max_temp:
                return False

        # Missing temperature check
        if applicability.get("missing_temperature"):
            if temperature is not None:
                return False

        # Red flag conditions
        if applicability.get("has_red_flags") and not has_red_flags:
            return False
        if applicability.get("no_red_flags") and has_red_flags:
            return False

        # Severity conditions
        severity = facts.get("reported_severity")
        severity_in = applicability.get("severity_in")
        severity_not_in = applicability.get("severity_not_in")

        if severity_in is not None:
            if severity not in severity_in:
                return False
        if severity_not_in is not None:
            if severity in severity_not_in:
                return False

        return True

    # ── Main evaluation ─────────────────────────────

    def evaluate(
        self,
        facts: dict,
        retrieved_rules: List[dict],
        established_facts: Optional[List[str]] = None,
        original_text: Optional[str] = None,
    ) -> dict:
        """
        Evaluate triage recommendation based on structured facts and retrieved rules.

        Returns a dict with:
        - decision: str
        - urgency: str or None
        - department: str or None
        - matched_rules: list of rule_ids
        - reasoning: str
        - escalate: bool
        - escalation_reason: str or None
        - reported: list
        - established: list
        - unknown: list
        """
        established_facts = established_facts or []

        category = facts.get("complaint_category", "other")
        reported_symptoms = facts.get("reported_symptoms", [])
        reported_severity = facts.get("reported_severity")
        reported_duration = facts.get("reported_duration")
        # Use both extracted symptoms AND original text for red flag matching
        all_symptom_text = " ".join(reported_symptoms).lower()
        search_text = all_symptom_text
        if original_text:
            search_text = all_symptom_text + " " + original_text.lower()

        # ── Step 1: Check if complaint is supported ──
        if category == "other" or not category:
            return self._escalation(
                reason="Complaint is outside the supported rule set. A human triage professional should review this case.",
                facts=facts,
                established_facts=established_facts,
            )

        # ── Step 2: Get category rules ──
        category_rules = self.get_rules_for_category(category)
        if not category_rules:
            return self._escalation(
                reason=f"No triage rules found for complaint category: {category}",
                facts=facts,
                established_facts=established_facts,
            )

        # ── Step 2b: Extract temperature from text ──
        temperature = self._extract_temperature(search_text)

        # ── Step 3: Check for red flags (rule-based) ──
        red_flag_matches = []
        for rule in category_rules:
            for flag in rule.get("red_flags", []):
                if self._text_contains_any(search_text, [flag]):
                    red_flag_matches.append({
                        "rule_id": rule["rule_id"],
                        "flag": flag,
                    })

        # Also check reported severity
        if reported_severity in ("severe", "critical"):
            red_flag_matches.append({
                "rule_id": category_rules[0]["rule_id"],
                "flag": f"Patient-reported severity: {reported_severity}",
            })

        has_red_flags = len(red_flag_matches) > 0

        # ── Step 3b: Detect critical symptom combinations from raw text ──
        critical_combos = self._detect_critical_combinations(search_text)
        if critical_combos:
            for combo in critical_combos:
                # Ensure at least one rule matches so we can cite it
                for rule in category_rules:
                    red_flag_matches.append({
                        "rule_id": rule["rule_id"],
                        "flag": combo["reason"],
                    })
                    break  # One match per combo is enough

        has_critical_combos = len(critical_combos) > 0
        escalate_always = has_critical_combos or len(red_flag_matches) >= 2

        # ── Step 4: Match retrieved rules ──
        matched_rules = []
        for rule in (retrieved_rules or []):
            rule_id = rule.get("rule_id", "")
            if rule_id in self.rules:
                matched_rules.append(rule)

        # Also include any red-flag matching rules
        red_flag_rule_ids = {m["rule_id"] for m in red_flag_matches}
        for rule_id in red_flag_rule_ids:
            rule = self.rules.get(rule_id)
            if rule and rule not in matched_rules:
                matched_rules.append(rule)

        # If no rules matched from retrieval, use all category rules as candidates
        if not matched_rules:
            matched_rules = category_rules

        # ── Step 5: Filter rules by applicability ──
        # Separate "primary" rules (with urgency) from "fallback" rules (insufficient info)
        primary_rules = []
        fallback_rules = []

        for rule in matched_rules:
            applicability = rule.get("applicability", {})
            if applicability.get("insufficient_info"):
                fallback_rules.append(rule)
            elif self._check_rule_applicability(rule, facts, has_red_flags, temperature):
                primary_rules.append(rule)

        # ── Step 6: Determine urgency from eligible rules ──
        if red_flag_matches:
            # Red flags detected — check if any escalation-only rules exist
            escalation_rules = [r for r in primary_rules if r.get("urgency") is None]
            if escalation_rules and not escalate_always:
                return self._escalation(
                    reason=f"Red flags detected: {red_flag_matches[0]['flag']}. High-risk features require human review.",
                    facts=facts,
                    established_facts=established_facts,
                    matched_rules=[r["rule_id"] for r in matched_rules],
                )

            # Pick the most urgent rule from eligible primary rules
            best_rule = min(
                (r for r in primary_rules if r.get("urgency")),
                key=lambda r: URGENCY_RANK.get(r.get("urgency"), 99),
                default=None,
            )

            # If no primary rule matched but we have red flags, use red-flag rules directly
            if best_rule is None:
                # Find rules that have red flags matching this category
                red_flag_rules = [
                    r for r in category_rules
                    if r.get("red_flags") and r.get("urgency")
                ]
                if red_flag_rules:
                    best_rule = min(
                        red_flag_rules,
                        key=lambda r: URGENCY_RANK.get(r.get("urgency"), 99),
                    )

            # If still no match, use fallback rules
            if best_rule is None and fallback_rules:
                best_rule = fallback_rules[0]  # Use the first insufficient-info rule

        else:
            # No red flags — pick from eligible primary rules
            if primary_rules:
                if reported_severity in ("severe", "critical"):
                    best_rule = min(
                        primary_rules,
                        key=lambda r: URGENCY_RANK.get(r.get("urgency", 99), 99),
                    )
                else:
                    # Pick the most urgent among eligible rules
                    best_rule = min(
                        primary_rules,
                        key=lambda r: URGENCY_RANK.get(r.get("urgency", 99), 99),
                    )
            elif fallback_rules:
                # No primary rules eligible — use fallback
                best_rule = fallback_rules[0]
            else:
                # No rules at all are eligible
                return self._escalation(
                    reason="No triage rule matches the patient's presentation. A human should review.",
                    facts=facts,
                    established_facts=established_facts,
                    matched_rules=[r["rule_id"] for r in matched_rules],
                )

        if best_rule is None:
            return self._escalation(
                reason="Could not determine a matching triage rule with sufficient confidence.",
                facts=facts,
                established_facts=established_facts,
                matched_rules=[r["rule_id"] for r in matched_rules],
            )

        # ── Step 7: Build evidence ──
        reported = self._build_evidence_list(facts, source="reported")
        unknown = self._build_unknown_list(
            facts, best_rule,
            temperature=temperature,
            established_facts=established_facts,
        )

        # ── Step 8: Build reasoning ──
        # Only cite rules that actually contributed to the decision
        applied_rule_ids = [best_rule["rule_id"]]
        # Also cite red-flag rules that triggered the escalation
        if red_flag_matches:
            for m in red_flag_matches:
                if m["rule_id"] not in applied_rule_ids:
                    applied_rule_ids.append(m["rule_id"])

        reasoning_parts = [
            best_rule.get("reasoning", ""),
        ]
        if red_flag_matches:
            reasoning_parts.append(f"Red flag detected: {red_flag_matches[0]['flag']}")
        if reported_severity:
            reasoning_parts.append(f"Patient-reported severity: {reported_severity}")
        if reported_duration:
            reasoning_parts.append(f"Duration: {reported_duration}")
        if temperature is not None:
            reasoning_parts.append(f"Temperature: {temperature}°F")

        # ── Step 9: Determine escalation ──
        # High-risk cases with critical combinations or multiple red flags
        # always get escalation=true alongside the triage recommendation
        escalate = False
        escalation_reason = None
        if escalate_always:
            escalate = True
            if critical_combos:
                escalation_reason = critical_combos[0]["reason"]
            elif red_flag_matches:
                escalation_reason = (
                    f"Multiple red-flag features detected: {red_flag_matches[0]['flag']}. "
                    "Chest pain with reported red-flag features requires urgent evaluation and human review."
                )

        return {
            "decision": "triage_recommendation",
            "urgency": best_rule.get("urgency"),
            "department": best_rule.get("department"),
            "matched_rules": applied_rule_ids,
            "reasoning": " ".join(reasoning_parts),
            "escalate": escalate,
            "escalation_reason": escalation_reason,
            "reported": reported,
            "established": established_facts,
            "unknown": unknown,
        }

    def _escalation(
        self,
        reason: str,
        facts: dict,
        established_facts: List[str],
        matched_rules: Optional[List[str]] = None,
    ) -> dict:
        reported = self._build_evidence_list(facts, source="reported")
        unknown = self._build_unknown_list(facts, rule=None)
        return {
            "decision": "human_review",
            "urgency": None,
            "department": None,
            "matched_rules": matched_rules or [],
            "reasoning": reason,
            "escalate": True,
            "escalation_reason": reason,
            "reported": reported,
            "established": established_facts,
            "unknown": unknown,
        }

    def _detect_critical_combinations(self, text: str) -> List[dict]:
        """
        Detect critical symptom combinations directly from patient text.
        Uses flexible keyword matching within semantic groups.
        Returns list of matched combination dicts.
        """
        text_lower = text.lower()
        matches = []

        for name, keyword_groups, min_groups, reason in CRITICAL_COMBINATIONS:
            groups_matched = 0
            for group_name, keywords in keyword_groups.items():
                for kw in keywords:
                    if kw in text_lower:
                        groups_matched += 1
                        break  # One keyword per group is enough
            if groups_matched >= min_groups:
                matches.append({
                    "name": name,
                    "groups_matched": groups_matched,
                    "reason": reason,
                })

        return matches

    def _text_contains_any(self, text: str, keywords: List[str]) -> bool:
        """Check if any keyword appears in the text (case-insensitive).
        Uses flexible matching: exact substring, word-level, and synonym expansion.
        """
        text_lower = text.lower()
        for kw in keywords:
            kw_lower = kw.lower()
            # 1. Direct substring match (fast path)
            if kw_lower in text_lower:
                return True

            # 2. Word-level matching (original logic)
            kw_words = kw_lower.split()
            if all(w in text_lower for w in kw_words if len(w) > 2):
                return True

            # 3. Synonym expansion: check if any synonym of the key concept appears
            for concept, synonyms in SYNONYM_GROUPS.items():
                # Check if this keyword is related to the concept
                if any(s in kw_lower for s in synonyms):
                    # Check if any synonym of that concept appears in the text
                    if any(s in text_lower for s in synonyms):
                        return True

        return False

    def _build_evidence_list(self, facts: dict, source: str = "reported") -> List[str]:
        """Build a human-readable evidence list from facts.
        Preserves detailed patient-reported information including
        radiation/location, associated symptoms, and descriptions.
        """
        items = []
        symptoms = facts.get("reported_symptoms", [])

        # Categorize symptoms for clearer evidence presentation
        for s in symptoms:
            s_lower = s.lower()
            # Check if this describes radiation or location
            if any(w in s_lower for w in [
                "spread", "spreading", "radiat", "to arm", "to jaw",
                "to back", "left arm", "right arm", "location"
            ]):
                items.append(f"Radiation/location: {s}")
            # Check if this is an associated/secondary symptom
            elif any(w in s_lower for w in [
                "sweat", "diaphoresis", "nausea", "vomit", "dizzy",
                "lightheaded", "fever", "temperature", "chills",
                "headache", "weakness", "fatigue"
            ]):
                items.append(f"Associated symptom: {s}")
            else:
                items.append(f"Symptom: {s}")

        # Include key phrases only if they provide genuinely new detail
        # (skip full patient text or very long phrases that just repeat symptoms)
        key_phrases = facts.get("key_phrases", [])
        symptom_text_lower = " ".join(symptoms).lower()
        for phrase in key_phrases:
            if (
                phrase
                and 15 < len(phrase) < 80
                and phrase.lower() not in symptom_text_lower
            ):
                items.append(f"Detail: {phrase}")

        # Patient notes (e.g., age information)
        notes = facts.get("patient_notes")
        if notes and notes not in ("null", None, ""):
            items.append(f"Note: {notes}")

        duration = facts.get("reported_duration")
        if duration:
            items.append(f"Duration: {duration}")

        severity = facts.get("reported_severity")
        if severity:
            items.append(f"Severity: {severity}")

        history = facts.get("reported_history", [])
        for h in history:
            items.append(f"History: {h}")

        return items

    def _build_unknown_list(
        self, facts: dict, rule: Optional[dict],
        temperature: Optional[float] = None,
        established_facts: Optional[List[str]] = None,
    ) -> List[str]:
        """Determine what important information is still unknown."""
        unknown = []
        established_facts = established_facts or []

        if not facts.get("reported_severity"):
            unknown.append("Severity level not reported")
        if not facts.get("reported_duration"):
            unknown.append("Duration of symptoms not reported")

        if rule:
            # Build a combined text of all known information for checking
            all_text = json.dumps(facts).lower()
            established_text = " ".join(established_facts).lower()
            combined_text = all_text + " " + established_text

            for req in rule.get("required_information", []):
                req_lower = req.lower()
                req_words = [kw for kw in req_lower.split() if len(kw) > 3]

                # Check if the required info is covered by facts or established text
                covered = any(kw in combined_text for kw in req_words)

                # Special case: temperature reading — check extracted value
                if not covered and "temperature" in req_lower:
                    if temperature is not None:
                        covered = True
                    # Also check if any symptom mentions a temperature value
                    for s in facts.get("reported_symptoms", []):
                        if re.search(r"\d+\.?\d*\s*°?\s*[fFcC]", s.lower()):
                            covered = True
                            break

                if not covered:
                    unknown.append(f"Information not provided: {req}")

        return unknown

    def check_escalation(
        self,
        facts: dict,
        evaluation: dict,
    ) -> Optional[str]:
        """Post-evaluation escalation check."""
        if evaluation.get("escalate"):
            return evaluation.get("escalation_reason")

        # Additional safety checks — use original text and symptoms
        symptoms = facts.get("reported_symptoms", [])
        text = " ".join(symptoms).lower()

        critical_patterns = [
            "chest pain", "shortness of breath", "difficulty breathing",
            "unconscious", "seizure", "severe bleeding",
        ]
        for pattern in critical_patterns:
            if pattern in text:
                # This should have been caught by rules, but add a safety net
                category = facts.get("complaint_category", "")
                if not category or category == "other":
                    return "Critical symptoms detected but complaint category is unclear. Human review recommended."

        return None


# Singleton
_rules_engine: Optional[TriageRulesEngine] = None


def get_rules_engine() -> TriageRulesEngine:
    global _rules_engine
    if _rules_engine is None:
        _rules_engine = TriageRulesEngine()
    return _rules_engine
