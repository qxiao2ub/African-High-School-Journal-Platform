# African High School Journal Platform

A Streamlit MVP for an AI-supported high-school research journal platform founded by Kavya. The platform is designed to help African high school students upload manuscripts, write drafts online, receive AI-assisted plagiarism checks, match submissions to teachers/professors with relevant expertise, collect peer-review recommendations, and publish accepted electronic papers in an online library.

This repository is intentionally built with a free/low-cost stack:

- Python 3.12+ recommended for Streamlit Community Cloud; Python 3.14 works locally if your dependencies support it.
- Streamlit for the web interface.
- SQLite for an MVP database.
- scikit-learn TF-IDF similarity for local AI-style matching and plagiarism similarity.
- pypdf and python-docx for PDF/DOCX text extraction.

> Important: This MVP does not search the whole internet for plagiarism. It compares a manuscript to the platform's local corpus: published manuscripts, submitted manuscripts, and the optional sample/source corpus. For production-level internet plagiarism checks, integrate a licensed plagiarism/search API and add an appeals process.

## Main functions

1. **Student upload and online writing**
   - Students can upload TXT, Markdown, PDF, or DOCX files.
   - Students can also draft directly in the browser and save the manuscript online.

2. **AI-based plagiarism detection**
   - Uses local TF-IDF cosine similarity to compare the submission with the platform corpus.
   - Shows matched source titles and similarity scores.
   - Flags high similarity so students can revise before final submission.

3. **AI-based reviewer matching**
   - Matches manuscripts to reviewers based on field, keywords, abstract, manuscript text, and reviewer expertise.
   - Creates reviewer assignments with shareable invite links.

4. **Reviewer portal**
   - Reviewers can view assigned manuscripts and submit recommendations: accept, minor revision, major revision, or reject.
   - Review comments are stored with the submission.

5. **Publication library**
   - Accepted papers can be published electronically and shown in the searchable public library.

## Repository structure

```text
african_high_school_journal_platform/
  app.py                                # Streamlit web app
  requirements.txt                      # Python dependencies
  ARCHITECTURE.md                       # Architecture and schema explanation
  schema.sql                            # SQLite schema
  README.md                             # Setup and deployment guide
  LICENSE                               # MIT license placeholder
  .streamlit/config.toml                # Streamlit UI settings
  data/
    seed_reviewers.csv                  # Demo reviewer database
    sample_corpus.csv                   # Demo comparison corpus
  journal_platform/
    __init__.py
    ai.py                               # Similarity, plagiarism, reviewer matching
    config.py                           # Configuration constants
    db.py                               # SQLite helpers
    document_io.py                      # PDF/DOCX/TXT extraction
    services.py                         # Platform business logic
  tests/
    smoke_test.py                       # End-to-end smoke test
  docs/
    AUTHOR_GUIDELINES.md                # Student submission guidance
    REVIEWER_GUIDELINES.md              # Reviewer criteria and tone
    EDITORIAL_POLICY.md                 # Editorial workflow and safeguards
    COPYRIGHT_AND_LICENSE_GUIDE.md      # Copyright/open-source notes
    ROADMAP.md                          # MVP and production roadmap
  notebooks/
    high_school_journal_platform_colab.ipynb
```

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate        # macOS/Linux
# .venv\Scripts\activate.bat    # Windows Command Prompt
python -m pip install -r requirements.txt
python tests/smoke_test.py
streamlit run app.py
```

## Run in Google Colab

1. Open `notebooks/high_school_journal_platform_colab.ipynb` in Google Colab.
2. Run each cell from top to bottom.
3. The notebook writes the project files, installs dependencies, runs the smoke test, and shows how to launch Streamlit.
4. For a public demo link from Colab, use the included optional tunnel cell. Colab sessions are temporary, so this is for demos, not stable hosting.

## Deploy on Streamlit Community Cloud

1. Create a GitHub repository.
2. Upload this project folder to the repository root.
3. Go to Streamlit Community Cloud and create an app from your GitHub repository.
4. Set the entrypoint file to `app.py`.
5. Let Streamlit install dependencies from `requirements.txt`.

## Suggested production upgrades

- Replace demo login with a proper authentication provider.
- Use PostgreSQL/Supabase/Firebase instead of SQLite for concurrent users.
- Store manuscripts in cloud object storage.
- Add consent, privacy, youth-safety, and data-retention policies for minors.
- Add licensed plagiarism/search integration.
- Add reviewer conflict-of-interest declarations.
- Add editor workflow with multiple reviewers before final decision.
- Add DOI/ISSN workflows only after formal journal governance is ready.

## Copyright and open source note

Kavya and contributors can publish the source code under an open-source license such as MIT, Apache-2.0, or GPL. The platform name, logo, website content, and source code copyright notices should be kept clear. Individual student papers should keep author copyright unless the journal adopts a stated publication license.
