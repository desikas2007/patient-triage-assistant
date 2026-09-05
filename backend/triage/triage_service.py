"""
Triage service for orchestrating the intake workflow.
Coordinates Gemini extraction, local retrieval, and the deterministic rules engine.
"""
import uuid
import json
import logging
from typing import Optional, Dict, Any, List

from backend.models import (
    PatientIntakeRequest,
    FollowUpRequest,
    TriageResult,
    FollowUpQuestion,
)
from backend.triage.rules_engine import get_rules_engine
from backend.ai.gemini_client import get_gemini_client
from backend.retrieval.retriever import get_retriever
from backend.database import save_session, get_session, delete_session

logger = logging.getLogger(__name__)


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
        self.rules_engine = get_rules_engine()
        self.gemini = get_gemini_client()
        self.retriever = get_retriever()

    # ── Main intake flow ─────────────────────────────

    async def process_intake(self, request: PatientIntakeRequest) -> TriageResult:
        """Process a new patient intake."""
        session_id = request.session_id or str(uuid.uuid4())
        patient_text = request.message

        # ── Step 1: Extract facts with Gemini ──
        try:
            facts = await self.gemini.extract_facts(patient_text)
        except Exception as e:
            logger.error(f"Gemini extraction failed: {e}")
            # Fallback: rule-based extraction
            facts = self._extract_facts_rule_based(patient_text)

        category = facts.get("complaint_category", "other")
        logger.info(f"Extracted facts: category={category}, symptoms={facts.get('reported_symptoms', [])}")

        # ── Step 2: Retrieve relevant rules ──
        try:
            # Build a search query from the facts
            search_query = self._facts_to_search_query(facts)
            retrieved_rules_with_scores = await self.retriever.search(search_query, top_k=5)
            retrieved_rules = [rule for rule, score in retrieved_rules_with_scores]
        except Exception as e:
            logger.warning(f"Retrieval failed, falling back to category rules: {e}")
            retrieved_rules = self.retriever.get_relevant_rules_for_category(category)

        # ── Step 3: Identify missing critical information ──
        category_rules = self.rules_engine.get_rules_for_category(category)
        all_required = []
        for rule in category_rules:
            all_required.extend(rule.get("required_information", []))
        # Deduplicate
        required_info = list(dict.fromkeys(all_required))

        if self.gemini.available:
            try:
                missing_info = await self.gemini.detect_missing_info(facts, required_info)
            except Exception as e:
                logger.warning(f"Missing info detection failed: {e}")
                missing_info = []
        else:
            # Without Gemini, check manually
            missing_info = self._detect_missing_manually(facts, required_info)

        # ── Step 4: Determine if follow-up is needed ──
        high_importance_missing = [
            m for m in missing_info
            if m.get("importance", "medium") == "high"
        ]

        # Trigger follow-up if critical info is missing AND we don't have enough
        # symptoms to make a safe triage decision without further inquiry.
        reported_symptoms = facts.get("reported_symptoms", [])
        has_severity = bool(facts.get("reported_severity"))
        has_duration = bool(facts.get("reported_duration"))
        needs_followup = (
            not reported_symptoms
            or (len(reported_symptoms) <= 1 and not has_severity and not has_duration)
        )

        if high_importance_missing and needs_followup:
            questions = await self._generate_follow_up_questions(
                missing_info, category
            )

            # Save session
            save_session(session_id, patient_text, facts, questions, {}, None, None)

            return TriageResult(
                status="follow_up_required",
                session_id=session_id,
                follow_up_questions=[
                    FollowUpQuestion(
                        question_id=q.get("question_id", f"q{i+1}"),
                        question_text=q.get("question_text", ""),
                        category=q.get("category", "general"),
                        priority=q.get("priority", "medium"),
                    )
                    for i, q in enumerate(questions)
                ],
                reported=self.rules_engine._build_evidence_list(facts),
                unknown=[m.get("field", "unknown") for m in missing_info],
            )

        # ── Step 5: Run rules engine ──
        evaluation = self.rules_engine.evaluate(
            facts=facts,
            retrieved_rules=retrieved_rules,
            original_text=patient_text,
        )

        # ── Step 6: Post-evaluation escalation check ──
        escalation_reason = self.rules_engine.check_escalation(facts, evaluation)
        if escalation_reason:
            evaluation["escalate"] = True
            evaluation["escalation_reason"] = escalation_reason

        # ── Step 7: Build response ──
        if evaluation["escalate"] and evaluation.get("urgency"):
            # High-risk case with triage recommendation: show BOTH
            # triage result AND human escalation warning
            result = TriageResult(
                status="complete",
                session_id=session_id,
                urgency=evaluation.get("urgency"),
                department=evaluation.get("department"),
                rule_ids=evaluation.get("matched_rules", []),
                reasoning=evaluation.get("reasoning", ""),
                reported=evaluation.get("reported", []),
                established=[],
                unknown=evaluation.get("unknown", []),
                escalation=True,
                escalation_reason=evaluation["escalation_reason"],
            )
        elif evaluation["escalate"]:
            # No triage recommendation possible — full human review
            result = TriageResult(
                status="human_review",
                session_id=session_id,
                reasoning=evaluation["reasoning"],
                reported=evaluation.get("reported", []),
                established=[],
                unknown=evaluation.get("unknown", []),
                escalation=True,
                escalation_reason=evaluation["escalation_reason"],
            )
        else:
            result = TriageResult(
                status="complete",
                session_id=session_id,
                urgency=evaluation.get("urgency"),
                department=evaluation.get("department"),
                rule_ids=evaluation.get("matched_rules", []),
                reasoning=evaluation.get("reasoning", ""),
                reported=evaluation.get("reported", []),
                established=[],
                unknown=evaluation.get("unknown", []),
                escalation=False,
            )

        # Save session
        save_session(
            session_id,
            patient_text,
            facts,
            [],  # follow-up questions (we went straight to result)
            {},  # answers
            evaluation.get("matched_rules", []),
            result.model_dump(),
        )

        return result

    # ── Follow-up flow ───────────────────────────────

    async def process_follow_up(self, request: FollowUpRequest) -> TriageResult:
        """Process follow-up answers and re-evaluate."""
        session_id = request.session_id

        # Load existing session
        session = get_session(session_id)
        if session is None:
            return TriageResult(
                status="human_review",
                session_id=session_id,
                reasoning="Session not found. Please start a new intake.",
                escalation=True,
                escalation_reason="Session expired or not found.",
            )

        # Merge facts
        existing_facts = json.loads(session.get("structured_facts", "{}")) if session.get("structured_facts") else {}
        patient_text = session.get("initial_patient_text", "")

        # Build enriched text from answers
        answers = request.answers
        enriched_text = patient_text
        established_facts = []
        for qid, answer in answers.items():
            if answer and answer.strip():
                enriched_text += f"\nFollow-up: {answer}"
                established_facts.append(answer)

        # Re-extract with Gemini (with enriched text)
        try:
            facts = await self.gemini.extract_facts(enriched_text)
        except Exception as e:
            logger.error(f"Gemini extraction failed on follow-up: {e}")
            facts = existing_facts

        # Merge old and new facts
        for key in ("reported_symptoms", "reported_history"):
            old = existing_facts.get(key, [])
            new = facts.get(key, [])
            if new:
                facts[key] = list(dict.fromkeys(old + new))
            else:
                facts[key] = old

        if facts.get("reported_severity") is None:
            facts["reported_severity"] = existing_facts.get("reported_severity")
        if facts.get("reported_duration") is None:
            facts["reported_duration"] = existing_facts.get("reported_duration")

        category = facts.get("complaint_category", existing_facts.get("complaint_category", "other"))

        # Retrieve rules
        try:
            search_query = self._facts_to_search_query(facts)
            retrieved = await self.retriever.search(search_query, top_k=5)
            retrieved_rules = [rule for rule, score in retrieved]
        except Exception:
            retrieved_rules = self.retriever.get_relevant_rules_for_category(category)

        # Check remaining missing info
        category_rules = self.rules_engine.get_rules_for_category(category)
        all_required = []
        for rule in category_rules:
            all_required.extend(rule.get("required_information", []))
        required_info = list(dict.fromkeys(all_required))

        if self.gemini.available:
            try:
                missing_info = await self.gemini.detect_missing_info(facts, required_info)
            except Exception:
                missing_info = []
        else:
            missing_info = self._detect_missing_manually(facts, required_info)

        high_importance_missing = [m for m in missing_info if m.get("importance") == "high"]

        # Check if we already had a follow-up round (enriched text has answers)
        had_prior_followup = bool(established_facts)

        if high_importance_missing and not had_prior_followup:
            # First round: still need more info
            questions = await self._generate_follow_up_questions(missing_info, category)
            save_session(session_id, patient_text, facts, questions, answers, None, None)

            return TriageResult(
                status="follow_up_required",
                session_id=session_id,
                follow_up_questions=[
                    FollowUpQuestion(
                        question_id=q.get("question_id", f"q{i+1}"),
                        question_text=q.get("question_text", ""),
                        category=q.get("category", "general"),
                        priority=q.get("priority", "medium"),
                    )
                    for i, q in enumerate(questions)
                ],
                reported=self.rules_engine._build_evidence_list(facts),
                established=established_facts,
                unknown=[m.get("field", "unknown") for m in missing_info],
            )

        # Enough info — run rules engine
        evaluation = self.rules_engine.evaluate(
            facts=facts,
            retrieved_rules=retrieved_rules,
            established_facts=established_facts,
            original_text=enriched_text,
        )

        escalation_reason = self.rules_engine.check_escalation(facts, evaluation)
        if escalation_reason:
            evaluation["escalate"] = True
            evaluation["escalation_reason"] = escalation_reason

        # Merge reported and established
        reported = evaluation.get("reported", [])

        if evaluation["escalate"] and evaluation.get("urgency"):
            # High-risk case with triage recommendation: show BOTH
            result = TriageResult(
                status="complete",
                session_id=session_id,
                urgency=evaluation.get("urgency"),
                department=evaluation.get("department"),
                rule_ids=evaluation.get("matched_rules", []),
                reasoning=evaluation.get("reasoning", ""),
                reported=reported,
                established=established_facts,
                unknown=evaluation.get("unknown", []),
                escalation=True,
                escalation_reason=evaluation["escalation_reason"],
            )
        elif evaluation["escalate"]:
            result = TriageResult(
                status="human_review",
                session_id=session_id,
                reasoning=evaluation["reasoning"],
                reported=reported,
                established=established_facts,
                unknown=evaluation.get("unknown", []),
                escalation=True,
                escalation_reason=evaluation["escalation_reason"],
            )
        else:
            result = TriageResult(
                status="complete",
                session_id=session_id,
                urgency=evaluation.get("urgency"),
                department=evaluation.get("department"),
                rule_ids=evaluation.get("matched_rules", []),
                reasoning=evaluation.get("reasoning", ""),
                reported=reported,
                established=established_facts,
                unknown=evaluation.get("unknown", []),
                escalation=False,
            )

        save_session(
            session_id, patient_text, facts,
            [], answers,
            evaluation.get("matched_rules", []),
            result.model_dump(),
        )

        return result

    # ── Helpers ──────────────────────────────────────

    async def get_rule_explanation(self, rule_id: str) -> Optional[dict]:
        return self.rules_engine.get_rule(rule_id)

    def reset_session(self, session_id: str) -> None:
        delete_session(session_id)

    def _extract_facts_rule_based(self, text: str) -> dict:
        """Rule-based fact extraction when Gemini is unavailable.
        Preserves detailed patient-stated facts for evidence extraction.
        """
        import re
        text_lower = text.lower()
        
        # Category detection by keyword - use primary complaint phrases
        # Priority: match the most specific/primary complaint first
        category_keywords = {
            "chest_pain": ["chest pain", "chest discomfort", "chest tightness", "chest pressure"],
            "breathing_difficulty": ["breathing difficulty", "shortness of breath", "can't breathe", "difficulty breathing", "trouble breathing", "breathless"],
            "abdominal_pain": ["abdominal pain", "stomach pain", "belly pain", "lower abdomen", "upper abdomen", "abdomen", "abdominal"],
            "injury": ["injury", "fell", "cut", "bleeding", "sprain", "broken", "hit", "accident"],
            "fever": ["fever", "temperature", "chills"],
        }
        
        category = "other"
        max_score = 0
        for cat, keywords in category_keywords.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > max_score:
                max_score = score
                category = cat
        
        # Extract detailed symptom phrases directly from patient text
        # Instead of generic labels, preserve the actual patient-stated details
        symptoms = []
        
        # Define symptom detection patterns that extract the ACTUAL phrases
        symptom_patterns = [
            # Chest pain variants
            (r"chest\s+(?:pain|discomfort|tightness|pressure)", lambda m: m.group(0)),
            # Radiation patterns
            (r"(?:spread|spreading|radiat\w*)\s+(?:to\s+)?(?:my\s+)?(?:left|right)?\s*\w*\s*arm",
             lambda m: m.group(0)),
            (r"(?:spread|spreading|radiat\w*)\s+to\s+(?:my\s+)?(?:left|right)?\s*\w*\s*(?:arm|jaw|back|shoulder)",
             lambda m: m.group(0)),
            (r"(?:to|into)\s+(?:my\s+)?(?:left|right)\s+arm",
             lambda m: f"pain {m.group(0)}" if 'arm' in m.group(0) else m.group(0)),
            # Breathing difficulty
            (r"(?:difficulty|trouble|problems?)\s+breathing",
             lambda m: m.group(0)),
            (r"(?:short(?:ness)?\s+(?:of\s+)?breath|breathless)",
             lambda m: m.group(0)),
            (r"can'?t\s+breathe", lambda m: m.group(0)),
            # Sweating / diaphoresis
            (r"(?:sweating|sweat|diaphoresis|perspiring|clammy)",
             lambda m: "sweating" if 'sweat' in m.group(0).lower() else m.group(0)),
            # Nausea / vomiting
            (r"(?:nausea|nauseous|queasy|vomiting|throw(?:ing)?\s+up)",
             lambda m: m.group(0)),
            # Pain general (only if no more specific pain already captured)
            (r"(?:\w+\s+)?pain", lambda m: m.group(0)),
            # Fever with temperature value
            (r"fever\s+(?:of\s+)?\d+\.?\d*\s*°?[fFcC]?", lambda m: m.group(0)),
            (r"temperature\s+(?:of\s+)?\d+\.?\d*\s*°?[fFcC]?", lambda m: m.group(0)),
            # Generic fever
            (r"fever", lambda m: m.group(0)),
            # Headache
            (r"headache", lambda m: m.group(0)),
            # Weakness / fatigue
            (r"(?:weakness|weak|fatigue|tired)", lambda m: m.group(0)),
            # Dizziness
            (r"(?:dizzy|lightheaded|dizziness)", lambda m: m.group(0)),
            # Bleeding
            (r"(?:bleeding|blood)", lambda m: m.group(0)),
            # Swelling
            (r"(?:swollen|swelling|swell\w*)", lambda m: m.group(0)),
            # Stiff neck
            (r"stiff\s+neck", lambda m: m.group(0)),
            # Confusion
            (r"(?:confus(?:ed|ion)|disoriented)", lambda m: m.group(0)),
        ]
        
        seen_patterns = set()
        for pattern, extractor in symptom_patterns:
            for match in re.finditer(pattern, text_lower):
                symptom = extractor(match).strip()
                # Deduplicate: skip if a more specific version already captured
                if symptom and symptom not in seen_patterns:
                    # Skip generic "pain" if we already have chest pain or a specific pain
                    if symptom == "pain" and any(
                        "pain" in s and s != "pain" for s in seen_patterns
                    ):
                        continue
                    # Skip generic "fever" if we already have a detailed fever
                    if symptom == "fever" and any(
                        "fever" in s and s != "fever" for s in seen_patterns
                    ):
                        continue
                    symptoms.append(symptom)
                    seen_patterns.add(symptom)
        
        # Extract severity keywords
        severity = None
        if any(w in text_lower for w in ["severe", "terrible", "worst", "extreme"]):
            severity = "severe"
        elif any(w in text_lower for w in ["moderate", "significant"]):
            severity = "moderate"
        elif any(w in text_lower for w in ["mild", "slight", "minor"]):
            severity = "mild"
        
        # Extract duration keywords
        duration = None
        for phrase in ["since yesterday", "since this morning", "since last night",
                       "for a few hours", "for an hour", "for 3 hours",
                       "for a couple of days"]:
            if phrase in text_lower:
                duration = phrase
                break
        # Also try regex for duration
        if not duration:
            dur_match = re.search(
                r"(?:for|since)\s+(?:the\s+)?(?:past\s+)?\d+\s+(?:hour|day|week|month)s?",
                text_lower,
            )
            if dur_match:
                duration = dur_match.group(0)
        
        # Detect temperature value (e.g., 102°F)
        temp_match = re.search(
            r"(\d+\.?\d*)\s*°?\s*([fFcC])",
            text,
        )
        temperature_value = None
        if temp_match:
            temperature_value = f"{temp_match.group(1)}°{temp_match.group(2).upper()}"
            # If we have a fever symptom but no detailed version, add the temperature
            if temperature_value and not any("fever of" in s for s in symptoms):
                symptoms.insert(0, f"fever of {temperature_value}")
        
        # Detect age mentions
        patient_notes = None
        age_match = re.search(r"(\d+)\s*(?:year|yo|yr|years old)", text_lower)
        if age_match:
            patient_notes = f"Age mentioned: {age_match.group(1)}"
        
        # Detect conditions
        history = []
        condition_keywords = ["diabetes", "asthma", "copd", "heart disease",
                             "high blood pressure", "immunocompromised"]
        for cond in condition_keywords:
            if cond in text_lower:
                history.append(cond)
        
        return {
            "complaint_category": category,
            "reported_symptoms": symptoms,
            "reported_duration": duration,
            "reported_severity": severity,
            "reported_history": history,
            "key_phrases": [text[:200]],
            "patient_age": age_match.group(1) if age_match else None,
            "patient_notes": patient_notes,
        }

    def _facts_to_search_query(self, facts: dict) -> str:
        """Convert extracted facts to a search query."""
        parts = []
        cat = facts.get("complaint_category", "")
        if cat:
            parts.append(cat.replace("_", " "))
        symptoms = facts.get("reported_symptoms", [])
        parts.extend(symptoms)
        return " ".join(parts) if parts else "general triage"

    async def _generate_follow_up_questions(
        self,
        missing_info: List[dict],
        category: str,
    ) -> List[dict]:
        """Generate follow-up questions, with fallback to rule-based defaults."""
        if self.gemini.available:
            try:
                return await self.gemini.generate_follow_up_questions(missing_info, category)
            except Exception as e:
                logger.warning(f"Gemini follow-up generation failed: {e}")

        # Fallback: use questions from the category rules
        category_rules = self.rules_engine.get_rules_for_category(category)
        all_questions = []
        for rule in category_rules:
            all_questions.extend(rule.get("follow_up_questions", []))

        # Deduplicate and take top 5
        seen = set()
        unique = []
        for q in all_questions:
            if q not in seen:
                seen.add(q)
                unique.append({
                    "question_id": f"q{len(unique)+1}",
                    "question_text": q,
                    "category": "general",
                    "priority": "medium",
                })
            if len(unique) >= 5:
                break

        return unique

    def _detect_missing_manually(self, facts: dict, required_info: List[str]) -> List[dict]:
        """Manual missing info detection when Gemini is unavailable."""
        missing = []
        facts_text = json.dumps(facts).lower()

        for req in required_info:
            req_words = [w for w in req.lower().split() if len(w) > 3]
            if not any(w in facts_text for w in req_words):
                missing.append({
                    "field": req,
                    "importance": "high",
                    "reason": f"Required information: {req}",
                })

        return missing


# Singleton
_triage_service: Optional[TriageService] = None


def get_triage_service() -> TriageService:
    global _triage_service
    if _triage_service is None:
        _triage_service = TriageService()
    return _triage_service
