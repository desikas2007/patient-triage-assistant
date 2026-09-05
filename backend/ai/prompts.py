"""
Prompt templates for Patient Intake Triage Assistant.
Contains safe, structured prompts for medical triage support.
"""

# System instruction for all medical interactions
MEDICAL_SYSTEM_INSTRUCTION = """You are a medical triage assistant helping to process patient intake information.

IMPORTANT SAFETY RULES:
- You are NOT diagnosing medical conditions
- You are extracting information to help route patients to appropriate care
- Always recommend professional medical evaluation
- Never provide treatment recommendations
- Escalate uncertain or high-risk cases to human review

Your role is to:
1. Understand patient descriptions in natural language
2. Extract key symptoms, duration, severity, and relevant history
3. Identify missing critical information
4. Help generate appropriate follow-up questions

Be precise, factual, and conservative in your assessments."""


EXTRACT_FACTS_PROMPT = """Analyze the following patient intake description and extract structured information.

Patient description:
\"\"\"
{patient_text}
\"\"\"

Extract the following information in JSON format:
{{
    "complaint_category": "<one of: fever, injury, chest_pain, breathing_difficulty, abdominal_pain, other>",
    "reported_symptoms": ["<symptom1>", "<symptom2>", ...],
    "reported_duration": "<how long symptoms have been present, or null>",
    "reported_severity": "<patient's reported severity: mild/moderate/severe/critical, or null>",
    "reported_history": ["<relevant medical history mentioned>"],
    "key_phrases": ["<important phrases from the description>"]
}}

Only extract information that is explicitly stated or clearly implied by the patient.
Do not assume or infer symptoms not mentioned."""


IDENTIFY_MISSING_INFO_PROMPT = """Based on the extracted patient information, identify what critical information is missing for triage assessment.

Current extracted information:
{extracted_facts}

Complaint category: {complaint_category}

List the critical information that should be gathered, such as:
- Symptom severity if not reported
- Duration if not reported
- Relevant medical history
- Current medications
- Allergies
- Vital signs awareness (fever temperature, etc.)

Return as JSON array:
{{
    "missing_information": [
        {{"field": "<field_name>", "importance": "<high/medium/low>", "reason": "<why this is important>"}}
    ]
}}"""


GENERATE_FOLLOW_UP_PROMPT = """Generate clear, patient-friendly follow-up questions to gather missing information.

Missing information:
{missing_information}

Complaint category: {complaint_category}
Current facts: {extracted_facts}

Generate up to 5 follow-up questions that:
- Use simple, everyday language
- Are not leading or suggestive
- Help clarify severity and urgency
- Are appropriate for the complaint category

Return as JSON array:
{{
    "questions": [
        {{
            "question_id": "q1",
            "question_text": "<the question>",
            "category": "<severity/duration/history/medications/other>",
            "priority": "<high/medium/low>"
        }}
    ]
}}"""


TRIAGE_ASSESSMENT_PROMPT = """Based on all available patient information, provide a preliminary triage assessment.

Patient information:
{patient_facts}

Available rules and guidelines:
{matched_rules}

Provide your assessment in JSON format:
{{
    "urgency_level": <1-5 where 1=immediate, 5=no-show>,
    "urgency_rationale": "<brief explanation>",
    "department_recommendation": "<recommended department>",
    "concerns": ["<list of concerns>"],
    "requires_immediate_attention": <true/false>,
    "confidence": "<high/medium/low>",
    "notes": "<additional notes for the triage nurse>"
}}

Remember: This is a preliminary assessment to support human decision-making, not a final diagnosis."""
