"""
Triage-specific schemas and constants.
Defines urgency levels, departments, and category mappings.
"""
from enum import Enum
from typing import List


class UrgencyLevel(int, Enum):
    """Triage urgency levels (1=highest, 5=lowest)."""
    IMMEDIATE = 1  # Life-threatening, immediate treatment
    URGENT = 2     # Serious, treatment within minutes
    SEMI_URGENT = 3  # Significant, treatment within hours
    NON_URGENT = 4   # Minor, can wait
    NO_SHOW = 5      # Non-medical, not applicable


class ComplaintCategory(str, Enum):
    """Supported complaint categories."""
    FEVER = "fever"
    INJURY = "injury"
    CHEST_PAIN = "chest_pain"
    BREATHING_DIFFICULTY = "breathing_difficulty"
    ABDOMINAL_PAIN = "abdominal_pain"


# Urgency labels for display
URGENCY_LABELS = {
    UrgencyLevel.IMMEDIATE: "Immediate",
    UrgencyLevel.URGENT: "Urgent",
    UrgencyLevel.SEMI_URGENT: "Semi-Urgent",
    UrgencyLevel.NON_URGENT: "Non-Urgent",
    UrgencyLevel.NO_SHOW: "Non-Medical",
}

# Department mappings
DEPARTMENTS = {
    ComplaintCategory.FEVER: "Emergency / Internal Medicine",
    ComplaintCategory.INJURY: "Emergency / Trauma",
    ComplaintCategory.CHEST_PAIN: "Emergency / Cardiology",
    ComplaintCategory.BREATHING_DIFFICULTY: "Emergency / Pulmonology",
    ComplaintCategory.ABDOMINAL_PAIN: "Emergency / General Surgery",
}

# Red flags by category (indicators requiring immediate attention)
RED_FLAGS = {
    ComplaintCategory.CHEST_PAIN: [
        "chest pain radiating to arm or jaw",
        "shortness of breath with chest pain",
        "sweating and nausea with chest pain",
        "history of heart disease",
    ],
    ComplaintCategory.BREATHING_DIFFICULTY: [
        "severe shortness of breath",
        "cannot speak in full sentences",
        "blue lips or fingernails",
        "history of asthma or COPD",
    ],
    ComplaintCategory.ABDOMINAL_PAIN: [
        "severe sudden abdominal pain",
        "blood in stool or vomit",
        "rigid abdomen",
        "fever with abdominal pain",
    ],
    ComplaintCategory.FEVER: [
        "fever above 103°F (39.4°C)",
        "fever with stiff neck",
        "fever with rash",
        "fever in immunocompromised patient",
    ],
    ComplaintCategory.INJURY: [
        "visible bone or deformity",
        "uncontrolled bleeding",
        "loss of sensation or movement",
        "head injury with confusion",
    ],
}
