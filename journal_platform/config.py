from pathlib import Path
import os

APP_NAME = "African High School Journal Platform"
PUBLICATION_NAME = "High School Research Journal"
APP_TAGLINE = "AI-supported student research submission, peer review, revision, and open electronic publication"
AUTHOR_NAME = "Kavya Kaushal Shah"
ADVISOR_NAME = "Dr. Qingyang Xiao"
GITHUB_URL = os.getenv(
    "JOURNAL_GITHUB_URL",
    "https://github.com/qxiao2ub/African-High-School-Journal-Platform",
)
APP_URL = os.getenv(
    "JOURNAL_APP_URL",
    "https://african-high-school-journal-platform.streamlit.app/",
)

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
ASSETS_DIR = BASE_DIR / "assets"
DATA_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = Path(os.getenv("JOURNAL_DB_PATH", DATA_DIR / "journal_platform.db"))
SCHEMA_PATH = BASE_DIR / "schema.sql"
SEED_REVIEWERS_PATH = DATA_DIR / "seed_reviewers.csv"
SAMPLE_CORPUS_PATH = DATA_DIR / "sample_corpus.csv"

LOGO_PATH = ASSETS_DIR / "journal-seal.png"
HERO_PATH = ASSETS_DIR / "hero-classroom.jpg"
FAVICON_PATH = ASSETS_DIR / "favicon.png"

PLAGIARISM_LOW_THRESHOLD = 0.20
PLAGIARISM_HIGH_THRESHOLD = 0.45
TOP_REVIEWERS = 3
