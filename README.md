TRACK_ID=PS6

# Patient Intake Triage Assistant

## What the Project Does

The Patient Intake Triage Assistant is an AI-powered healthcare application that helps medical staff route patients to appropriate care departments. It processes patient descriptions written in natural language, extracts structured information, identifies missing critical data, retrieves relevant triage rules, and provides evidence-based routing recommendations.

Key capabilities:
- Understands patient descriptions in everyday language
- Extracts structured medical facts from free text
- Asks follow-up questions when critical information is missing
- Retrieves relevant local triage rules using semantic search
- Applies deterministic rules for consistent triage decisions
- Recommends urgency level and appropriate department
- Shows the rule behind each recommendation
- Escalates uncertain or high-risk cases to human review
- Never diagnoses - only supports intake routing

## Technology Stack

### Frontend
- React 18
- Vite 5
- JavaScript (ES6+)
- Tailwind CSS 3
- Modern, professional healthcare SaaS design

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- Pydantic (data validation)
- SQLite (local database)

### AI & Retrieval
- Google Gemini API (gemini-2.0-flash)
- Gemini gemini-embedding-001 (embeddings)
- NumPy (cosine similarity)
- Local JSON/Markdown knowledge base

## Project Structure

```
patient-triage-assistant/
├── app.py                    # Main entry point
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
│
├── backend/
│   ├── __init__.py
│   ├── api.py                # FastAPI routes
│   ├── config.py             # Configuration
│   ├── database.py           # SQLite setup
│   ├── models.py             # Pydantic schemas
│   │
│   ├── ai/
│   │   ├── __init__.py
│   │   ├── gemini_client.py  # Gemini API client
│   │   ├── embeddings.py     # Embedding generation
│   │   └── prompts.py        # Prompt templates
│   │
│   ├── triage/
│   │   ├── __init__.py
│   │   ├── rules_engine.py   # Deterministic rules
│   │   ├── triage_service.py # Main workflow
│   │   └── schemas.py        # Triage constants
│   │
│   └── retrieval/
│       ├── __init__.py
│       ├── retriever.py      # Vector search
│       └── index.py          # Embedding index
│
├── data/
│   ├── triage_rules.json     # Rules (structured)
│   ├── triage_rules.md       # Rules (readable)
│   └── embeddings/           # Cached embeddings
│
└── frontend/
    ├── package.json          # Node dependencies
    ├── vite.config.js        # Vite configuration
    ├── tailwind.config.js    # Tailwind theme
    ├── postcss.config.js     # PostCSS config
    ├── index.html            # HTML entry point
    │
    └── src/
        ├── main.jsx          # React entry
        ├── App.jsx           # Main component
        ├── api.js            # API client
        │
        ├── components/
        │   ├── Header.jsx
        │   ├── PatientIntake.jsx
        │   ├── SafetyNotice.jsx
        │   ├── LoadingState.jsx
        │   └── ErrorState.jsx
        │
        └── styles/
            └── index.css     # Tailwind base
```

## How to Run

### For Judging

No second terminal required. No frontend build command required during judging.

```bash
pip install -r requirements.txt
python app.py
```

Then open: http://localhost:8000

### For Development

**Backend:**
```bash
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
GEMINI_API_KEY=your_api_key_here
```

**Required:**
- `GEMINI_API_KEY` - Your Google Gemini API key

**Optional:**
- `GEMINI_MODEL` - Override Gemini model (default: gemini-2.0-flash)

## AI Architecture

The application separates AI language understanding from deterministic medical decision-making:

```
Patient Text
    ↓
Gemini (Structured Fact Extraction)
    ↓
Local Retrieval (Relevant Rules)
    ↓
Deterministic Rules Engine
    ↓
Safety Checks
    ↓
Recommendation OR Human Escalation
```

**Key Principles:**
- Gemini extracts facts, never makes final decisions
- Rules engine applies deterministic, auditable logic
- All recommendations cite specific rule IDs
- Uncertain cases escalate to human review

## Retrieval Architecture

The system uses local vector search for rule matching:

1. **Embeddings**: Generated using Gemini gemini-embedding-001
2. **Index**: Stored locally as NumPy arrays
3. **Search**: Cosine similarity for semantic matching
4. **Cache**: Embeddings cached to avoid regeneration

No external vector databases. No hosted services. Fully local.

## Safety Architecture

This is a healthcare application with strict safety requirements:

1. **No Diagnosis**: The system never diagnoses conditions
2. **Rule Citation**: Every recommendation cites a specific rule ID
3. **Human Escalation**: Uncertain or high-risk cases require human review
4. **Conservative Defaults**: When uncertain, escalate rather than guess
5. **Deterministic Logic**: Triage decisions are auditable and reproducible

## Generated Data

- `data/triage_rules.json` - Structured triage rules
- `data/triage_rules.md` - Human-readable rules documentation
- `data/embeddings/` - Cached rule embeddings (generated on first run)

## Demo Video

[Demo Video Placeholder - Will be added before submission]
