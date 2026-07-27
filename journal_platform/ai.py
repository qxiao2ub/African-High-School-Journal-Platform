from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


STOP_NOTICE = "This is a local similarity screen, not a misconduct judgment."


def normalize_text(text: str) -> str:
    text = text or ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def safe_vectorizer(max_features: int = 5000) -> TfidfVectorizer:
    return TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        max_features=max_features,
        min_df=1,
    )


@dataclass
class SimilarityMatch:
    title: str
    similarity: float
    source_type: str = "local"
    url: str = ""


def similarity_rankings(candidate_text: str, corpus: Iterable[dict], top_n: int = 5) -> list[SimilarityMatch]:
    candidate_text = normalize_text(candidate_text)
    records = [r for r in corpus if normalize_text(str(r.get("source_text", "") or r.get("manuscript_text", "")))]
    if not candidate_text or not records:
        return []

    corpus_texts = [normalize_text(str(r.get("source_text", "") or r.get("manuscript_text", ""))) for r in records]
    vectorizer = safe_vectorizer()
    try:
        matrix = vectorizer.fit_transform([candidate_text] + corpus_texts)
    except ValueError:
        return []
    sims = cosine_similarity(matrix[0:1], matrix[1:]).ravel()
    order = np.argsort(sims)[::-1][:top_n]
    matches: list[SimilarityMatch] = []
    for idx in order:
        record = records[int(idx)]
        matches.append(
            SimilarityMatch(
                title=str(record.get("title") or f"Source {idx + 1}"),
                similarity=float(sims[int(idx)]),
                source_type=str(record.get("source_type") or record.get("status") or "local"),
                url=str(record.get("url") or ""),
            )
        )
    return matches


def plagiarism_scan(candidate_text: str, corpus: Iterable[dict], top_n: int = 5) -> dict:
    matches = similarity_rankings(candidate_text, corpus, top_n=top_n)
    score = max([m.similarity for m in matches], default=0.0)
    if score >= 0.45:
        risk = "high"
    elif score >= 0.20:
        risk = "medium"
    else:
        risk = "low"
    report_lines = [STOP_NOTICE, f"Overall local similarity risk: {risk.upper()} ({score:.1%})."]
    if matches:
        report_lines.append("Top local matches:")
        for m in matches:
            report_lines.append(f"- {m.title}: {m.similarity:.1%} similarity ({m.source_type})")
    else:
        report_lines.append("No local corpus matches were available.")
    return {
        "score": float(score),
        "risk": risk,
        "matches": [m.__dict__ for m in matches],
        "report": "\n".join(report_lines),
    }


def manuscript_profile(title: str, abstract: str, field: str, keywords: str, manuscript_text: str) -> str:
    return normalize_text(" ".join([title or "", abstract or "", field or "", keywords or "", manuscript_text or ""]))


def match_reviewers(
    title: str,
    abstract: str,
    field: str,
    keywords: str,
    manuscript_text: str,
    reviewers: Iterable[dict],
    top_n: int = 3,
) -> list[dict]:
    reviewer_records = [r for r in reviewers if normalize_text(str(r.get("expertise", "")))]
    if not reviewer_records:
        return []

    profile = manuscript_profile(title, abstract, field, keywords, manuscript_text)
    reviewer_texts = [normalize_text(str(r.get("expertise", ""))) for r in reviewer_records]
    vectorizer = safe_vectorizer(max_features=4000)
    try:
        matrix = vectorizer.fit_transform([profile] + reviewer_texts)
    except ValueError:
        return []
    sims = cosine_similarity(matrix[0:1], matrix[1:]).ravel()
    field_terms = {x.strip().lower() for x in re.split(r"[,;/]", field or "") if x.strip()}
    scored = []
    for idx, reviewer in enumerate(reviewer_records):
        expertise = str(reviewer.get("expertise", "")).lower()
        field_bonus = 0.10 if any(term and term in expertise for term in field_terms) else 0.0
        score = min(float(sims[idx]) + field_bonus, 1.0)
        scored.append(
            {
                "user_id": reviewer.get("user_id"),
                "name": reviewer.get("name"),
                "email": reviewer.get("email"),
                "country": reviewer.get("country"),
                "expertise": reviewer.get("expertise"),
                "match_score": score,
            }
        )
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:top_n]


def extract_top_terms(text: str, limit: int = 8) -> list[str]:
    text = normalize_text(text)
    if not text:
        return []
    vectorizer = safe_vectorizer(max_features=1000)
    try:
        matrix = vectorizer.fit_transform([text])
    except ValueError:
        return []
    scores = matrix.toarray()[0]
    terms = np.array(vectorizer.get_feature_names_out())
    if scores.size == 0:
        return []
    order = np.argsort(scores)[::-1]
    return [str(terms[i]) for i in order[:limit] if scores[i] > 0]
