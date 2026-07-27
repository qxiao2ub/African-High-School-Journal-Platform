from pathlib import Path
import os

APP_NAME = "African High School Research Journal"
APP_TAGLINE = "AI-supported student research submission, review, and publication"

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DB_PATH = Path(os.getenv("JOURNAL_DB_PATH", DATA_DIR / "journal_platform.db"))
SCHEMA_PATH = BASE_DIR / "schema.sql"
SEED_REVIEWERS_PATH = DATA_DIR / "seed_reviewers.csv"
SAMPLE_CORPUS_PATH = DATA_DIR / "sample_corpus.csv"

PLAGIARISM_LOW_THRESHOLD = 0.20
PLAGIARISM_HIGH_THRESHOLD = 0.45
TOP_REVIEWERS = 3
