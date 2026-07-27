from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from .ai import extract_top_terms, plagiarism_scan, match_reviewers, word_count
from .config import DB_PATH, TOP_REVIEWERS
from .db import execute, fetch_all, fetch_one, initialize_with_seed_data, upsert_user


def slugify(text: str, max_len: int = 70) -> str:
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return (text[:max_len].strip("-") or "paper")


def setup_platform(db_path: Path | str = DB_PATH, reset: bool = False) -> dict[str, int]:
    return initialize_with_seed_data(db_path, reset=reset)


def get_reviewers(db_path: Path | str = DB_PATH) -> list[dict[str, Any]]:
    return fetch_all(db_path, "SELECT * FROM users WHERE role = 'reviewer' ORDER BY name")


def get_local_similarity_corpus(db_path: Path | str = DB_PATH, exclude_manuscript_id: int | None = None) -> list[dict[str, Any]]:
    sources = fetch_all(
        db_path,
        "SELECT title, source_type, source_text, url FROM plagiarism_sources ORDER BY created_at DESC",
    )
    params: tuple[Any, ...] = ()
    where = "WHERE status IN ('submitted', 'under_review', 'accepted', 'published')"
    if exclude_manuscript_id is not None:
        where += " AND manuscript_id != ?"
        params = (exclude_manuscript_id,)
    manuscripts = fetch_all(
        db_path,
        f"""
        SELECT title, status AS source_type, manuscript_text AS source_text, '' AS url
        FROM manuscripts
        {where}
        ORDER BY updated_at DESC
        """,
        params,
    )
    return sources + manuscripts


def save_draft(
    db_path: Path | str,
    student_name: str,
    student_email: str,
    country: str,
    title: str,
    abstract: str,
    field: str,
    keywords: str,
    manuscript_text: str,
    file_name: str = "online-editor",
) -> int:
    author_id = upsert_user(db_path, student_name, student_email, "student", country=country)
    manuscript_id = execute(
        db_path,
        """
        INSERT INTO manuscripts
        (title, abstract, field, keywords, author_user_id, author_name, country, status, manuscript_text, file_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
        """,
        (title, abstract, field, keywords, author_id, student_name, country, manuscript_text, file_name),
    )
    execute(
        db_path,
        "INSERT INTO manuscript_versions (manuscript_id, version_label, manuscript_text) VALUES (?, ?, ?)",
        (manuscript_id, "draft", manuscript_text),
    )
    return manuscript_id


def submit_manuscript(
    db_path: Path | str,
    student_name: str,
    student_email: str,
    country: str,
    title: str,
    abstract: str,
    field: str,
    keywords: str,
    manuscript_text: str,
    file_name: str = "online-editor",
    plagiarism_override: dict | None = None,
) -> dict[str, Any]:
    author_id = upsert_user(db_path, student_name, student_email, "student", country=country)
    corpus = get_local_similarity_corpus(db_path)
    scan = plagiarism_override or plagiarism_scan(manuscript_text, corpus, top_n=5)
    manuscript_id = execute(
        db_path,
        """
        INSERT INTO manuscripts
        (title, abstract, field, keywords, author_user_id, author_name, country, status, manuscript_text,
         file_name, plagiarism_score, plagiarism_report, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """,
        (
            title,
            abstract,
            field,
            keywords,
            author_id,
            student_name,
            country,
            manuscript_text,
            file_name,
            float(scan["score"]),
            scan["report"],
        ),
    )
    execute(
        db_path,
        "INSERT INTO manuscript_versions (manuscript_id, version_label, manuscript_text) VALUES (?, ?, ?)",
        (manuscript_id, "submitted", manuscript_text),
    )
    assignments = assign_reviewers(db_path, manuscript_id, top_n=TOP_REVIEWERS)
    matched_summary = "; ".join([f"{a['name']} ({a['match_score']:.1%})" for a in assignments])
    execute(
        db_path,
        "UPDATE manuscripts SET status = 'under_review', matched_reviewers = ?, updated_at = CURRENT_TIMESTAMP WHERE manuscript_id = ?",
        (matched_summary, manuscript_id),
    )
    return {"manuscript_id": manuscript_id, "plagiarism": scan, "assignments": assignments}


def assign_reviewers(db_path: Path | str, manuscript_id: int, top_n: int = TOP_REVIEWERS) -> list[dict[str, Any]]:
    manuscript = fetch_one(db_path, "SELECT * FROM manuscripts WHERE manuscript_id = ?", (manuscript_id,))
    if manuscript is None:
        raise ValueError(f"Unknown manuscript_id: {manuscript_id}")
    reviewers = get_reviewers(db_path)
    matches = match_reviewers(
        title=manuscript["title"],
        abstract=manuscript["abstract"] or "",
        field=manuscript["field"] or "",
        keywords=manuscript["keywords"] or "",
        manuscript_text=manuscript["manuscript_text"] or "",
        reviewers=reviewers,
        top_n=top_n,
    )
    for match in matches:
        link = f"?assignment_id={manuscript_id}-{match['user_id']}"
        execute(
            db_path,
            """
            INSERT OR IGNORE INTO review_assignments
            (manuscript_id, reviewer_user_id, match_score, assignment_link)
            VALUES (?, ?, ?, ?)
            """,
            (manuscript_id, match["user_id"], float(match["match_score"]), link),
        )
        match["assignment_link"] = link
    return matches


def list_manuscripts(db_path: Path | str = DB_PATH, status: str | None = None) -> list[dict[str, Any]]:
    if status:
        return fetch_all(db_path, "SELECT * FROM manuscripts WHERE status = ? ORDER BY updated_at DESC", (status,))
    return fetch_all(db_path, "SELECT * FROM manuscripts ORDER BY updated_at DESC")


def list_published(db_path: Path | str = DB_PATH, query: str = "") -> list[dict[str, Any]]:
    query = (query or "").strip().lower()
    rows = fetch_all(db_path, "SELECT * FROM manuscripts WHERE status = 'published' ORDER BY published_at DESC")
    if not query:
        return rows
    return [
        r
        for r in rows
        if query in (r.get("title") or "").lower()
        or query in (r.get("abstract") or "").lower()
        or query in (r.get("keywords") or "").lower()
        or query in (r.get("author_name") or "").lower()
    ]


def get_assignments_for_reviewer(db_path: Path | str, reviewer_email: str) -> list[dict[str, Any]]:
    reviewer_email = reviewer_email.strip().lower()
    return fetch_all(
        db_path,
        """
        SELECT a.*, m.title, m.abstract, m.field, m.keywords, m.manuscript_text, m.author_name,
               m.country, m.status AS manuscript_status, u.name AS reviewer_name, u.email AS reviewer_email
        FROM review_assignments a
        JOIN manuscripts m ON m.manuscript_id = a.manuscript_id
        JOIN users u ON u.user_id = a.reviewer_user_id
        WHERE lower(u.email) = ?
        ORDER BY a.created_at DESC
        """,
        (reviewer_email,),
    )


def add_review(
    db_path: Path | str,
    manuscript_id: int,
    reviewer_name: str,
    reviewer_email: str,
    recommendation: str,
    comments_to_author: str,
    comments_to_editor: str = "",
    confidence: int = 3,
) -> int:
    reviewer_id = upsert_user(db_path, reviewer_name, reviewer_email, "reviewer")
    review_id = execute(
        db_path,
        """
        INSERT INTO reviews
        (manuscript_id, reviewer_user_id, reviewer_name, reviewer_email, recommendation,
         comments_to_author, comments_to_editor, confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            manuscript_id,
            reviewer_id,
            reviewer_name,
            reviewer_email.strip().lower(),
            recommendation,
            comments_to_author,
            comments_to_editor,
            confidence,
        ),
    )
    execute(
        db_path,
        """
        UPDATE review_assignments
        SET status = 'completed'
        WHERE manuscript_id = ? AND reviewer_user_id = ?
        """,
        (manuscript_id, reviewer_id),
    )
    next_status = {
        "accept": "accepted",
        "minor_revision": "minor_revision",
        "major_revision": "major_revision",
        "reject": "rejected",
    }[recommendation]
    execute(
        db_path,
        "UPDATE manuscripts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE manuscript_id = ?",
        (next_status, manuscript_id),
    )
    return review_id


def list_reviews(db_path: Path | str, manuscript_id: int) -> list[dict[str, Any]]:
    return fetch_all(db_path, "SELECT * FROM reviews WHERE manuscript_id = ? ORDER BY created_at DESC", (manuscript_id,))


def publish_manuscript(db_path: Path | str, manuscript_id: int) -> str:
    manuscript = fetch_one(db_path, "SELECT * FROM manuscripts WHERE manuscript_id = ?", (manuscript_id,))
    if manuscript is None:
        raise ValueError(f"Unknown manuscript_id: {manuscript_id}")
    base_slug = slugify(manuscript["title"])
    doi_slug = f"ahsj-2026-{manuscript_id}-{base_slug}"
    execute(
        db_path,
        """
        UPDATE manuscripts
        SET status = 'published', doi_slug = ?, published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE manuscript_id = ?
        """,
        (doi_slug, manuscript_id),
    )
    return doi_slug


def update_status(db_path: Path | str, manuscript_id: int, status: str) -> None:
    execute(db_path, "UPDATE manuscripts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE manuscript_id = ?", (status, manuscript_id))


def manuscript_stats(db_path: Path | str = DB_PATH) -> dict[str, Any]:
    rows = fetch_all(db_path, "SELECT status, COUNT(*) AS n FROM manuscripts GROUP BY status")
    stats = {row["status"]: row["n"] for row in rows}
    stats["reviewers"] = fetch_one(db_path, "SELECT COUNT(*) AS n FROM users WHERE role = 'reviewer'")["n"]
    stats["students"] = fetch_one(db_path, "SELECT COUNT(*) AS n FROM users WHERE role = 'student'")["n"]
    return stats


def manuscript_quality_hints(text: str) -> list[str]:
    hints = []
    wc = word_count(text)
    if wc < 500:
        hints.append("The manuscript is short for a research paper. Consider expanding methods, results, and discussion.")
    lowered = (text or "").lower()
    for section in ["abstract", "introduction", "methods", "results", "discussion", "references"]:
        if section not in lowered:
            hints.append(f"Consider adding or clearly labeling a {section.title()} section.")
    terms = extract_top_terms(text, limit=6)
    if terms:
        hints.append("AI keyword suggestions: " + ", ".join(terms))
    return hints
