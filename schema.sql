PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'reviewer', 'admin')),
    country TEXT,
    expertise TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manuscripts (
    manuscript_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    abstract TEXT,
    field TEXT NOT NULL,
    keywords TEXT,
    author_user_id INTEGER,
    author_name TEXT,
    country TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'submitted', 'under_review', 'minor_revision', 'major_revision', 'accepted', 'rejected', 'published')
    ),
    manuscript_text TEXT NOT NULL,
    file_name TEXT,
    plagiarism_score REAL NOT NULL DEFAULT 0.0,
    plagiarism_report TEXT NOT NULL DEFAULT '',
    matched_reviewers TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TEXT,
    published_at TEXT,
    doi_slug TEXT UNIQUE,
    FOREIGN KEY (author_user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS manuscript_versions (
    version_id INTEGER PRIMARY KEY AUTOINCREMENT,
    manuscript_id INTEGER NOT NULL,
    version_label TEXT NOT NULL,
    manuscript_text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manuscript_id) REFERENCES manuscripts(manuscript_id)
);

CREATE TABLE IF NOT EXISTS plagiarism_sources (
    source_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'local',
    source_text TEXT NOT NULL,
    url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_assignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    manuscript_id INTEGER NOT NULL,
    reviewer_user_id INTEGER NOT NULL,
    match_score REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'completed')),
    assignment_link TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (manuscript_id, reviewer_user_id),
    FOREIGN KEY (manuscript_id) REFERENCES manuscripts(manuscript_id),
    FOREIGN KEY (reviewer_user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    manuscript_id INTEGER NOT NULL,
    reviewer_user_id INTEGER,
    reviewer_name TEXT NOT NULL,
    reviewer_email TEXT,
    recommendation TEXT NOT NULL CHECK (recommendation IN ('accept', 'minor_revision', 'major_revision', 'reject')),
    comments_to_author TEXT NOT NULL,
    comments_to_editor TEXT NOT NULL DEFAULT '',
    confidence INTEGER NOT NULL DEFAULT 3 CHECK (confidence BETWEEN 1 AND 5),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manuscript_id) REFERENCES manuscripts(manuscript_id),
    FOREIGN KEY (reviewer_user_id) REFERENCES users(user_id)
);
