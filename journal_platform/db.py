from __future__ import annotations

import csv
import sqlite3
from pathlib import Path
from typing import Any, Iterable

from .config import DB_PATH, SCHEMA_PATH, SEED_REVIEWERS_PATH, SAMPLE_CORPUS_PATH


def get_connection(db_path: Path | str = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def initialize_database(db_path: Path | str = DB_PATH, reset: bool = False) -> None:
    db_path = Path(db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    if reset and db_path.exists():
        db_path.unlink()
    with get_connection(db_path) as conn:
        schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
        conn.executescript(schema_sql)
        conn.commit()


def execute(db_path: Path | str, sql: str, params: Iterable[Any] = ()) -> int:
    with get_connection(db_path) as conn:
        cur = conn.execute(sql, tuple(params))
        conn.commit()
        return int(cur.lastrowid or 0)


def fetch_all(db_path: Path | str, sql: str, params: Iterable[Any] = ()) -> list[dict[str, Any]]:
    with get_connection(db_path) as conn:
        rows = conn.execute(sql, tuple(params)).fetchall()
    return [dict(row) for row in rows]


def fetch_one(db_path: Path | str, sql: str, params: Iterable[Any] = ()) -> dict[str, Any] | None:
    rows = fetch_all(db_path, sql, params)
    return rows[0] if rows else None


def upsert_user(
    db_path: Path | str,
    name: str,
    email: str,
    role: str,
    country: str | None = None,
    expertise: str | None = None,
) -> int:
    email = email.strip().lower()
    existing = fetch_one(db_path, "SELECT user_id FROM users WHERE email = ?", (email,))
    if existing:
        execute(
            db_path,
            """
            UPDATE users
            SET name = ?, role = ?, country = COALESCE(?, country), expertise = COALESCE(?, expertise)
            WHERE email = ?
            """,
            (name.strip(), role, country, expertise, email),
        )
        return int(existing["user_id"])
    return execute(
        db_path,
        """
        INSERT INTO users (name, email, role, country, expertise)
        VALUES (?, ?, ?, ?, ?)
        """,
        (name.strip(), email, role, country, expertise),
    )


def seed_reviewers(db_path: Path | str, csv_path: Path | str = SEED_REVIEWERS_PATH) -> int:
    csv_path = Path(csv_path)
    if not csv_path.exists():
        return 0
    count = 0
    with csv_path.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            fields = row.get("fields", "")
            expertise = row.get("expertise", "")
            combined = f"{expertise}; fields: {fields}".strip()
            upsert_user(
                db_path,
                name=row.get("name", "Reviewer").strip(),
                email=row.get("email", "").strip(),
                role="reviewer",
                country=row.get("country", "").strip(),
                expertise=combined,
            )
            count += 1
    return count


def seed_sample_corpus(db_path: Path | str, csv_path: Path | str = SAMPLE_CORPUS_PATH) -> int:
    csv_path = Path(csv_path)
    if not csv_path.exists():
        return 0
    inserted = 0
    with csv_path.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            title = row.get("title", "Untitled source").strip()
            text = row.get("source_text", "").strip()
            if not text:
                continue
            existing = fetch_one(db_path, "SELECT source_id FROM plagiarism_sources WHERE title = ?", (title,))
            if existing:
                continue
            execute(
                db_path,
                """
                INSERT INTO plagiarism_sources (title, source_type, source_text, url)
                VALUES (?, ?, ?, ?)
                """,
                (title, row.get("source_type", "seed"), text, row.get("url", "")),
            )
            inserted += 1
    return inserted


def initialize_with_seed_data(db_path: Path | str = DB_PATH, reset: bool = False) -> dict[str, int]:
    initialize_database(db_path, reset=reset)
    reviewers = seed_reviewers(db_path)
    sources = seed_sample_corpus(db_path)
    return {"reviewers": reviewers, "sources": sources}
