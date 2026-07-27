# Architecture and Data Schema

## Goal

Build a practical MVP for an electronic high-school journal platform focused on African students. The MVP supports submission, online drafting, AI-assisted plagiarism screening, reviewer matching, peer-review recommendations, and electronic publication.

## High-level architecture

```text
Browser
  |
  v
Streamlit UI (app.py)
  |
  v
Business services (journal_platform/services.py)
  |
  +--> AI similarity and matching (journal_platform/ai.py)
  +--> File text extraction (journal_platform/document_io.py)
  +--> SQLite persistence (journal_platform/db.py)
  |
  v
SQLite database + optional CSV seed data
```

## Main entities

### users
Stores students, reviewers, and admins. In this MVP, authentication is demo-only: a user enters name, email, role, country, and optional expertise.

### manuscripts
Stores uploaded or online-written manuscripts, metadata, status, plagiarism summary, matched reviewer summary, and publication slug.

Status values:

- draft
- submitted
- under_review
- minor_revision
- major_revision
- accepted
- rejected
- published

### manuscript_versions
Stores historical text snapshots. Each saved draft or submitted manuscript can be versioned.

### review_assignments
Stores AI-matched reviewers and assignment state.

### reviews
Stores reviewer recommendation and comments.

### plagiarism_sources
Stores external or local corpus entries used for similarity checks. The demo seeds sample source texts from `data/sample_corpus.csv`.

## AI logic

### Plagiarism similarity
The MVP uses TF-IDF vectorization and cosine similarity against a local corpus. It reports the top matching sources and an overall similarity score. This is not a legal or academic misconduct determination; it is a revision aid.

### Reviewer matching
The matcher builds a manuscript profile from title, field, abstract, keywords, and text. It compares that profile against reviewer expertise profiles using TF-IDF cosine similarity and adds a field match bonus.

## Core workflow

1. Student signs in with demo profile.
2. Student uploads a file or writes in the online editor.
3. AI plagiarism scan compares the submission against the local corpus.
4. Student revises or submits.
5. AI reviewer matcher assigns top reviewers.
6. Reviewer enters portal, reads assignment, and leaves recommendation/comments.
7. Editor/admin can update status and publish accepted papers.
8. Published papers appear in the public library.

## Security and governance limitations

This MVP is not production-secure. Before real student use, add:

- real authentication and authorization;
- parental/guardian consent process if required;
- moderation and safeguarding policy;
- encrypted storage and backups;
- data retention and removal process;
- reviewer conflict-of-interest disclosures;
- audit logs;
- terms of use and privacy policy;
- accessibility review;
- independent editorial board governance.
