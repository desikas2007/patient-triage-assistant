# Triage Rules Reference

This document contains triage rules for the Patient Intake Triage Assistant.

---

## Rule FEVER-001: Low-grade fever, short duration, no red flags

**Category:** Fever  
**Urgency:** Non-Urgent  
**Department:** Primary Care

### Required Information
- Temperature reading
- Duration of fever
- Associated symptoms

### Red Flags
(None)

### Reasoning
Low-grade fever (below 101°F) with short duration and no associated red flags can often be managed in primary care.

### Escalation Conditions
- Temperature exceeds 101°F
- Fever persists more than 2 days

---

## Rule FEVER-002: Moderate fever with associated symptoms

**Category:** Fever  
**Urgency:** Semi-Urgent  
**Department:** Internal Medicine

### Required Information
- Temperature reading
- Duration of fever
- Associated symptoms
- Recent travel history

### Red Flags
- Fever above 103°F (39.4°C)
- Fever with stiff neck
- Fever with rash

### Reasoning
Moderate fever with associated symptoms requires evaluation in internal medicine to identify potential infection source.

### Escalation Conditions
- Temperature exceeds 103°F
- Fever persists more than 3 days
- Immunocompromised patient

---

## Rule FEVER-003: High fever with neurological or systemic red flags

**Category:** Fever  
**Urgency:** Urgent  
**Department:** Emergency Department

### Required Information
- Temperature reading
- Associated symptoms
- Mental status

### Red Flags
- Fever above 103°F (39.4°C)
- Fever with stiff neck
- Fever with confusion
- Fever in immunocompromised patient

### Reasoning
High fever with neurological signs suggests possible serious infection requiring emergency evaluation.

### Escalation Conditions
- Altered mental status
- Signs of sepsis
- Fever with seizures

---

## Rule FEVER-004: Fever - insufficient information for safe triage

**Category:** Fever  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
- Temperature reading
- Duration of fever
- Associated symptoms

### Red Flags
(None)

### Reasoning
Insufficient information to determine fever severity. Cannot safely apply a triage rule without basic temperature data.

### Escalation Conditions
- Patient unable to provide temperature information
- Infant or elderly with fever

---

## Rule INJURY-001: Minor injury with no red flags

**Category:** Injury  
**Urgency:** Non-Urgent  
**Department:** Primary Care / Urgent Care

### Required Information
- Mechanism of injury
- Location of injury
- Ability to move affected area

### Red Flags
(None)

### Reasoning
Minor injury with full range of motion and no red flags can be managed in primary care or urgent care.

### Escalation Conditions
(None)

---

## Rule INJURY-002: Moderate injury requiring urgent evaluation

**Category:** Injury  
**Urgency:** Urgent  
**Department:** Emergency / Trauma

### Required Information
- Mechanism of injury
- Location of injury
- Ability to move affected area
- Presence of bleeding
- Time since injury

### Red Flags
- Visible bone or deformity
- Uncontrolled bleeding
- Loss of sensation or movement

### Reasoning
Injury with possible fracture or significant soft tissue damage requires urgent emergency evaluation.

### Escalation Conditions
- Suspected fracture
- Loss of consciousness
- Injury to vital areas

---

## Rule INJURY-003: Head injury with concerning symptoms

**Category:** Injury  
**Urgency:** Urgent  
**Department:** Emergency Department

### Required Information
- Mechanism of injury
- Loss of consciousness
- Neurological symptoms

### Red Flags
- Head injury with confusion
- Loss of consciousness
- Severe headache after head trauma

### Reasoning
Head injury with neurological symptoms requires emergency evaluation to rule out intracranial injury.

### Escalation Conditions
- Prolonged loss of consciousness
- Progressive neurological symptoms
- Suspected skull fracture

---

## Rule INJURY-004: Injury - mechanism and severity unclear

**Category:** Injury  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
- Mechanism of injury
- Location of injury
- Ability to move affected area

### Red Flags
(None)

### Reasoning
Insufficient information to determine injury severity. Cannot safely route without understanding mechanism and current status.

### Escalation Conditions
- High-energy mechanism of injury
- Patient unable to describe the event

---

## Rule CHEST-001: Chest pain with cardiac red flags

**Category:** Chest Pain  
**Urgency:** Urgent  
**Department:** Emergency / Cardiology

### Required Information
- Pain characteristics
- Radiation of pain
- Associated symptoms
- Duration of pain
- Cardiac risk factors

### Red Flags
- Chest pain radiating to arm or jaw
- Shortness of breath with chest pain
- Sweating and nausea with chest pain
- History of heart disease

### Reasoning
Chest pain with cardiac red flags requires immediate evaluation to rule out acute coronary syndrome.

### Escalation Conditions
- Pain radiating to arm/jaw
- Associated shortness of breath
- Diaphoresis with chest pain
- Known cardiac history

---

## Rule CHEST-002: Chest pain without cardiac red flags

**Category:** Chest Pain  
**Urgency:** Semi-Urgent  
**Department:** Emergency Department

### Required Information
- Pain characteristics
- Duration of pain
- Associated symptoms

### Red Flags
(None)

### Reasoning
Chest pain without obvious cardiac red flags still requires emergency evaluation but may be lower acuity.

### Escalation Conditions
- New onset chest pain in patient over 40
- Chest pain with unexplained weight loss

---

## Rule CHEST-003: Chest pain - information insufficient for safe triage

**Category:** Chest Pain  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
- Pain characteristics
- Duration of pain
- Associated symptoms

### Red Flags
(None)

### Reasoning
Chest pain requires thorough evaluation. Insufficient information to determine cardiac risk. Cannot safely apply a triage rule.

### Escalation Conditions
- Patient unable to describe symptoms
- Chest pain in patient over 50 with unknown history

---

## Rule BREATH-001: Severe respiratory distress with red flags

**Category:** Breathing Difficulty  
**Urgency:** Urgent  
**Department:** Emergency / Pulmonology

### Required Information
- Onset of symptoms
- Severity of breathlessness
- Ability to speak

### Red Flags
- Severe shortness of breath
- Cannot speak in full sentences
- Blue lips or fingernails
- History of asthma or COPD

### Reasoning
Severe breathing difficulty with red flags indicates respiratory distress requiring immediate emergency evaluation.

### Escalation Conditions
- Unable to speak in sentences
- Cyanosis
- Respiratory rate > 30

---

## Rule BREATH-002: Moderate breathing difficulty

**Category:** Breathing Difficulty  
**Urgency:** Semi-Urgent  
**Department:** Emergency / Pulmonology

### Required Information
- Onset of symptoms
- Severity of breathlessness
- Triggers or alleviating factors
- Respiratory history

### Red Flags
(None)

### Reasoning
Moderate breathing difficulty without severe red flags requires urgent evaluation but may not be immediately life-threatening.

### Escalation Conditions
- Breathing difficulty worsening rapidly
- Breathing difficulty with chest pain

---

## Rule BREATH-003: Breathing difficulty - insufficient information

**Category:** Breathing Difficulty  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
- Onset of symptoms
- Severity of breathlessness

### Red Flags
(None)

### Reasoning
Breathing difficulty can range from mild to life-threatening. Insufficient information to determine severity.

### Escalation Conditions
- Patient unable to provide information due to distress
- Breathing difficulty with inability to speak

---

## Rule ABDOM-001: Abdominal pain with surgical red flags

**Category:** Abdominal Pain  
**Urgency:** Urgent  
**Department:** Emergency / General Surgery

### Required Information
- Location of pain
- Onset and duration
- Pain characteristics
- Associated symptoms

### Red Flags
- Severe sudden abdominal pain
- Blood in stool or vomit
- Rigid abdomen
- Fever with abdominal pain
- Inability to pass gas or stool

### Reasoning
Abdominal pain with red flags suggests possible surgical emergency requiring urgent evaluation.

### Escalation Conditions
- Peritoneal signs
- GI bleeding
- Suspected appendicitis
- Suspected bowel obstruction

---

## Rule ABDOM-002: Abdominal pain without red flags

**Category:** Abdominal Pain  
**Urgency:** Semi-Urgent  
**Department:** Internal Medicine / Emergency Department

### Required Information
- Location of pain
- Onset and duration
- Pain characteristics
- Associated symptoms

### Red Flags
(None)

### Reasoning
Abdominal pain without red flags still requires evaluation but may be managed less urgently.

### Escalation Conditions
- Pain worsening over time
- Abdominal pain with unexplained weight loss

---

## Rule ABDOM-003: Abdominal pain - insufficient information

**Category:** Abdominal Pain  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
- Location of pain
- Onset and duration
- Pain characteristics

### Red Flags
(None)

### Reasoning
Abdominal pain has wide differential. Insufficient information to determine severity or route safely.

### Escalation Conditions
- Elderly patient with abdominal pain
- Abdominal pain in pregnant patient

---

## Rule GEN-001: Fever combined with breathing difficulty

**Category:** Fever / Breathing Difficulty  
**Urgency:** Urgent  
**Department:** Emergency Department

### Required Information
- Temperature reading
- Breathing status
- Oxygen saturation

### Red Flags
- Fever with difficulty breathing
- Fever above 103°F
- Shortness of breath

### Reasoning
Fever combined with breathing difficulty suggests possible pneumonia or serious respiratory infection requiring emergency evaluation.

### Escalation Conditions
- SpO2 below 94%
- Unable to speak in sentences
- High fever with respiratory distress

---

## Rule GEN-002: Conflicting or unclear symptom presentation

**Category:** Multiple  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
- Clear symptom description
- Onset
- Associated symptoms

### Red Flags
(None)

### Reasoning
Symptom description is unclear or conflicting. Cannot determine appropriate triage category with confidence.

### Escalation Conditions
- Symptoms do not clearly match any category
- Patient report is inconsistent

---

## Rule GEN-003: Complaint outside supported categories

**Category:** Other  
**Urgency:** Requires Human Review  
**Department:** Requires Human Review

### Required Information
(None)

### Red Flags
(None)

### Reasoning
The described complaint does not fall within the supported triage categories (fever, injury, chest pain, breathing difficulty, abdominal pain). This case should be reviewed by a human triage professional.

### Escalation Conditions
- Unsupported complaint category
- Symptoms outside the rule base
