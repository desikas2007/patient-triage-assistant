"""
Database module for Patient Intake Triage Assistant.
Uses SQLite for session management.
"""
import sqlite3
import json
import logging
from pathlib import Path
from contextlib import contextmanager
from typing import Optional

from backend.config import DATABASE_PATH

logger = logging.getLogger(__name__)


def init_database() -> None:
    """Initialize the SQLite database and create tables if they don't exist."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                initial_patient_text TEXT NOT NULL,
                structured_facts TEXT,
                follow_up_questions TEXT,
                follow_up_answers TEXT,
                matched_rules TEXT,
                final_triage_note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_sessions_created_at
            ON sessions(created_at)
        """)

        conn.commit()
        logger.info("Database initialized successfully")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


def save_session(
    session_id: str,
    patient_text: str,
    facts: dict,
    follow_up_questions: list,
    answers: dict,
    matched_rules: list,
    triage_note: dict,
) -> None:
    """Save or update a session."""
    with get_db() as conn:
        conn.execute("""
            INSERT OR REPLACE INTO sessions
            (session_id, initial_patient_text, structured_facts,
             follow_up_questions, follow_up_answers,
             matched_rules, final_triage_note)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            patient_text,
            json.dumps(facts) if facts else None,
            json.dumps(follow_up_questions) if follow_up_questions else None,
            json.dumps(answers) if answers else None,
            json.dumps(matched_rules) if matched_rules else None,
            json.dumps(triage_note) if triage_note else None,
        ))
        conn.commit()


def get_session(session_id: str) -> Optional[dict]:
    """Retrieve a session by ID."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM sessions WHERE session_id = ?",
            (session_id,)
        ).fetchone()
        if row:
            return dict(row)
        return None


def delete_session(session_id: str) -> None:
    """Delete a session."""
    with get_db() as conn:
        conn.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
        conn.commit()
