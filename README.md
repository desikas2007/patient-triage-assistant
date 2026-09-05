TRACK_ID=PS01

# Patient Intake Triage Assistant

## Judge Quick Start

1. Install **Python 3.11+**
2. Open the project root directory
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Start the application:
   ```
   python app.py
   ```
5. Open in browser: **http://localhost:8000**
6. Use the patient intake screen or select a demo case

> **Backend and frontend are served together on port 8000.**
> No second terminal is required. No frontend build command is required for judging.

---

## 1. Problem Statement

Patient intake often arrives as incomplete, free-form descriptions written in everyday language. Triage staff must interpret these descriptions, identify missing critical information, and route the patient to the correct department — all under time pressure.

This project solves that problem with an **AI-assisted patient intake triage assistant** that:

- Accepts patient descriptions in natural language
- Extracts structured medical facts from free text
- Detects missing critical information and asks follow-up questions
- Retrieves relevant local triage rules
- Makes a deterministic routing decision based on a predefined rule set

**Supported complaint categories:**

- Fever
- Injury
- Chest Pain
- Breathing Difficulty
- Abdominal Pain

> **This system is a triage/routing assistant. It is NOT a diagnostic system.**
> It does not diagnose diseases or prescribe treatment.

---

## 2. Solution Overview

```
Patient Input
    ↓
Natural Language Understanding (Gemini API)
    ↓
Structured Fact Extraction
    ↓
Missing Information Detection
    ↓
Follow-up Questions (when required)
    ↓
Local Rule Retrieval (NumPy cosine similarity)
    ↓
Deterministic Triage Rules Engine
    ↓
Urgency Level + Department + Rule Citation
    ↓
Human Escalation (when uncertain or high-risk)
    ↓
Final Triage Note
```

**Layer responsibilities:**

| Layer | What It Does |
|-------|-------------|
| **Gemini API** | Extracts structured facts from patient text, detects missing information, generates follow-up questions |
| **Local Retrieval** | Uses Gemini embeddings + NumPy cosine similarity to find the most relevant triage rules |
| **Rules Engine** | The **final decision authority** — applies deterministic local rules to produce the triage routing recommendation |
| **Safety Checks** | Validates output, detects escalation conditions, ensures high-risk cases reach human review |

> **Key design principle:** Gemini is used for language understanding and information extraction. The deterministic local rules engine makes the final triage routing decision. Gemini never directly determines urgency or department.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite 5 | Patient intake UI |
| Styling | Tailwind CSS 3 | Healthcare SaaS design system |
| Backend | Python 3.11 + FastAPI | API and application server |
| Server | Uvicorn | ASGI server |
| Database | SQLite | Local session/state storage |
| AI | Google Gemini API (gemini-2.0-flash) | Natural-language understanding |
| Embeddings | gemini-embedding-001 | Local semantic retrieval |
| Retrieval | NumPy | Cosine similarity for rule matching |
| Decision Logic | Python rule engine | Deterministic triage routing |
| Deployment | FastAPI static serving | Serves built frontend + API on one port |

---

## 4. Single-Port Architecture

This project runs as a **single application on a single port**.

```
Frontend + Backend
        ↓
     FastAPI
        ↓
   Port 8000
```

- The React frontend is **pre-built** into `frontend/dist/`
- FastAPI serves the built frontend files as static assets
- FastAPI also exposes the `/api/*` endpoints
- **No separate frontend development server is required**
- **No second terminal is required**
- **No `npm run dev` is required** for the final application
- The complete application runs on **port 8000**

---

## 5. Run the Application

**Prerequisites:** Python 3.11+

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Start the application:**
```bash
python app.py
```

**Open in browser:**
```
http://localhost:8000
```

> No second terminal is required.
> No frontend build is required for judging because `frontend/dist/` is already included.

---

## 6. Environment Variables

Create a `.env` file based on `.env.example`:

```
GEMINI_API_KEY=your_api_key_here
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Google Gemini API key for AI-powered fact extraction |
| `GEMINI_MODEL` | Optional | Override Gemini model (default: `gemini-2.0-flash`) |

**The application works without a Gemini API key** using rule-based fallbacks for fact extraction, missing info detection, and follow-up question generation. AI accuracy is reduced without the key.

> **Never commit your `.env` file.** It is included in `.gitignore`.

---

## 7. Features

- **Natural-language patient intake** — accepts descriptions in plain everyday language
- **Incomplete information detection** — identifies missing critical data for safe triage
- **Relevant follow-up questions** — asks focused questions when important information is missing
- **Five supported triage categories** — fever, injury, chest pain, breathing difficulty, abdominal pain
- **Deterministic rule-based triage** — final routing decision is auditable and reproducible
- **Rule/reason citation** — every recommendation references specific rule IDs
- **Evidence separation** — clearly distinguishes patient-reported vs follow-up-established vs unknown facts
- **Human escalation** — uncertain or high-risk cases are automatically escalated to human review
- **Local rule retrieval** — semantic search over local triage rules using Gemini embeddings
- **SQLite session handling** — session persistence for multi-step intake flows
- **Professional React healthcare interface** — clean, modern clinical SaaS design
- **Single-port deployment** — frontend and backend served from port 8000
- **Safe API key handling** — `.env` file ignored, no keys in source code
- **No diagnosis or treatment recommendations** — triage routing assistant only

---

## 8. Triage Rules

The project contains a small, explicit local triage rule set.

**Files:**
- `data/triage_rules.json` — 20 structured rules in JSON format
- `data/triage_rules.md` — Human-readable rules documentation

**Each rule contains:**
- Rule ID (e.g., `FEVER-001`, `CHEST-001`)
- Complaint category
- Urgency level (immediate / urgent / semi-urgent / non-urgent)
- Recommended department
- Required information for safe triage
- Red flag indicators
- Follow-up questions
- Reasoning text
- Escalation conditions

**Rules by category:**

| Category | Rules | Coverage |
|----------|-------|----------|
| Fever | FEVER-001 through FEVER-004 + GEN-001 | Low-grade to high fever, fever + breathing |
| Injury | INJURY-001 through INJURY-004 | Minor to severe, head injury |
| Chest Pain | CHEST-001 through CHEST-003 + GEN-002 | Cardiac red flags, unclear presentation |
| Breathing Difficulty | BREATH-001 through BREATH-003 | Severe distress to moderate |
| Abdominal Pain | ABDOM-001 through ABDOM-003 | Surgical flags to insufficient info |
| General | GEN-003 | Outside supported categories |

> This is a hackathon prototype using a bounded rule set. Rules do not represent comprehensive clinical guidelines.

---

## 9. Safety and Escalation

This application is a **triage routing assistant, not a diagnostic system.**

- **No diagnosis:** The system never diagnoses conditions or recommends treatment
- **No guessing:** When required information is missing, the system asks follow-up questions rather than guessing
- **Human escalation:** High-risk or uncertain cases are escalated to human review
- **Rule traceability:** Every recommendation is traceable to a specific local triage rule
- **Unknown information:** Facts that could not be obtained remain explicitly marked as unknown
- **Prompt injection defense:** Patient text is treated as untrusted data; prompts instruct the AI to never follow instructions embedded in patient text

**Escalation triggers:**
- Complaint outside the supported rule set
- Insufficient information to safely apply a triage rule
- Red flags detected in a high-risk presentation
- All matched rules require human review
- Post-evaluation safety checks detect critical patterns

---

## 10. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/triage` | Process patient intake text |
| POST | `/api/follow-up` | Process follow-up question answers |
| GET | `/api/rules/{rule_id}` | Get details for a specific triage rule |
| POST | `/api/session/reset` | Reset a triage session |

**Interactive API docs** are available at `http://localhost:8000/docs` (Swagger UI).

---

## 11. Project Structure

```
patient-triage-assistant/
├── app.py                        # Main entry point (python app.py)
├── requirements.txt              # Python dependencies
├── README.md                     # This file
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
│
├── backend/
│   ├── __init__.py
│   ├── api.py                    # FastAPI routes (/api/*)
│   ├── config.py                 # Centralized configuration
│   ├── database.py               # SQLite session storage
│   ├── models.py                 # Pydantic request/response schemas
│   │
│   ├── ai/
│   │   ├── __init__.py
│   │   ├── gemini_client.py      # Gemini API client (fact extraction, follow-up)
│   │   ├── embeddings.py         # Gemini embedding generation + caching
│   │   └── prompts.py            # Prompt templates
│   │
│   ├── triage/
│   │   ├── __init__.py
│   │   ├── rules_engine.py       # Deterministic rules engine (final authority)
│   │   ├── triage_service.py     # Main workflow orchestrator
│   │   └── schemas.py            # Triage constants and enums
│   │
│   └── retrieval/
│       ├── __init__.py
│       ├── retriever.py          # Local vector search
│       └── index.py              # Embedding index (NumPy)
│
├── data/
│   ├── triage_rules.json         # 20 structured triage rules
│   ├── triage_rules.md           # Human-readable rules documentation
│   └── embeddings/               # Cached embeddings (generated on first run)
│
└── frontend/
    ├── dist/                     # Pre-built frontend (committed for judging)
    │   ├── index.html
    │   └── assets/
    ├── src/                      # React source code
    │   ├── App.jsx
    │   ├── api.js
    │   └── components/
    └── package.json
```

---

## 12. How It Works

### Step 1: Patient Input
A patient description is entered in natural language via the intake form or a pre-loaded demo case.

### Step 2: Natural Language Understanding
When the Gemini API key is configured, Gemini extracts structured facts:
- Complaint category
- Reported symptoms
- Severity level
- Duration
- Medical history

Without Gemini, a local rule-based extractor uses keyword matching.

### Step 3: Missing Information Detection
The system compares extracted facts against the required information for the identified complaint category. High-importance gaps trigger follow-up questions.

### Step 4: Follow-up Questions
Focused questions are generated (by Gemini or from local rule defaults) to fill critical information gaps. The patient answers, and the system re-evaluates.

### Step 5: Local Rule Retrieval
Gemini embeddings + NumPy cosine similarity find the most relevant triage rules from the local knowledge base.

### Step 6: Deterministic Rules Engine
The rules engine — the **final decision authority** — applies the matched rules:
- Checks for red flags
- Determines urgency level
- Selects recommended department
- Cites specific rule IDs

### Step 7: Safety & Escalation
Post-evaluation checks ensure:
- High-risk cases escalate to human review
- Uncertain cases do not receive unsafe recommendations
- Every output is traceable to a rule

### Step 8: Final Triage Note
The frontend displays:
- Urgency level and recommended department
- Patient-reported vs follow-up-established vs unknown facts
- Reasoning and referenced rules
- Escalation notice (when applicable)

---

## 13. AI Architecture

The application maintains a clear separation between AI language understanding and deterministic medical decision-making:

1. **Gemini (Language Understanding):** Extracts structured facts from patient text, detects missing information, generates follow-up questions
2. **Local Retrieval:** Uses Gemini embeddings + NumPy cosine similarity to find relevant triage rules from the local knowledge base
3. **Deterministic Rules Engine:** Applies local rules to make the final triage routing decision
4. **Safety Checks:** Validates output, checks for escalation conditions

**Key Principles:**
- Gemini extracts facts; it never makes final triage decisions
- The rules engine applies deterministic, auditable logic
- All recommendations cite specific rule IDs
- Uncertain cases escalate to human review
- Patient text is treated as untrusted data (prompt injection defense)

---

## 14. Safety Notice

> **This application does not diagnose medical conditions.**
> All recommendations are preliminary and require professional medical evaluation.
> Every recommendation references specific local triage rules.
