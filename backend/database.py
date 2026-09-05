"""
Database module for Patient Intake Triage Assistant.
Uses SQLite for local storage.
"""
import sqlite3
from pathlib import Path
from contextlib import contextmanager

from backend.config import DATABASE_PATH


def init_database() -> None:
    """Initialize the SQLite database and create tables if they don't exist."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.cursor()

        # Sessions table - stores intake sessions
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

        # Indexes for common queries
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_sessions_created_at 
            ON sessions(created_at)
        """)

        conn.commit()


def get_db_connection() -> sqlite3.Connection:
    """Get a database connection."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()
