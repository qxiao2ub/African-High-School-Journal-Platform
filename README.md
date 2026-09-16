# African High School Journal Platform

A GitHub-ready Streamlit application for an AI-supported high school research journal focused on African student authors. The platform supports manuscript writing and upload, local similarity screening, AI-assisted reviewer matching, structured peer review, editorial decisions, and open electronic publication.

**Founder / Author / Main Builder:** Kavya Kaushal Shah  
**Advisor / Mentor:** Dr. Qingyang Xiao

- **Live Streamlit application:** https://african-high-school-journal-platform.streamlit.app/
- **GitHub repository:** https://github.com/qxiao2ub/African-High-School-Journal-Platform

![Streamlit UI preview](docs/STREAMLIT_UI_PREVIEW.png)

## UI migration completed

The supplied Lovable/Vite/React journal design has been migrated into the launchable Streamlit application. The new interface preserves the Python journal workflow while adopting the prototype's:

- navy, cream, and gold editorial color system;
- newspaper-style masthead and journal seal;
- serif publication typography and structured navigation;
- classroom hero imagery and research-story cards;
- publication cards, workflow panels, and responsive layouts;
- professional student, reviewer, and editorial workspaces.

The original React design files are retained under `ui_design_reference/react_vite_prototype/` for design provenance and future front-end work. Streamlit deploys only the root Python application; the React reference does not need to be built for Streamlit Community Cloud.

## Core capabilities

### Student author workspace

- Upload DOCX, PDF, Markdown, or plain-text manuscripts.
- Write and revise directly in the online manuscript studio.
- Save online drafts and track submissions by email.
- Receive AI-assisted section and keyword suggestions.
- Run a transparent local similarity screen before submission.

### AI-assisted integrity support

- Uses TF-IDF vectorization and cosine similarity.
- Compares the manuscript with the platform's local source corpus and submitted manuscripts.
- Reports the highest matching sources and similarity percentages.
- Clearly labels the result as a revision aid, not a plagiarism or misconduct verdict.

### AI reviewer matching

- Profiles each manuscript using title, field, abstract, keywords, and full text.
- Compares the manuscript profile with reviewer expertise descriptions.
- Applies a field-match bonus and ranks the best available reviewers.
- Creates shareable assignment links that open the Reviewer Desk.

### Reviewer Desk

- Shows reviewer assignments by email or assignment link.
- Provides a read-only manuscript view.
- Collects comments to the author and confidential comments to the editor.
- Supports accept, minor revision, major revision, and reject recommendations.
- Includes a reviewer ethics and conflict-of-interest confirmation.

### Editorial Office

- Displays manuscript pipeline metrics and status charts.
- Adds or updates reviewer expertise profiles.
- Inspects similarity reports and reviewer recommendations.
- Updates editorial status and publishes accepted papers electronically.
- Exports manuscripts and reviewer records to CSV.

### Open publication library

- Searches published papers by title, abstract, author, country, and keywords.
- Filters results by research field.
- Displays professional article cards and full publication views.
- Provides plain-text publication downloads and stable journal slugs.

## Technology stack

- Python 3.12+ recommended
- Streamlit
- SQLite
- pandas and NumPy
- scikit-learn TF-IDF and cosine similarity
- pypdf and python-docx
- GitHub and Streamlit Community Cloud
- Google Colab/Jupyter notebook
- Automated service and UI-integration smoke tests

## Repository structure

```text
african_high_school_journal_platform/
  app.py
  requirements.txt
  README.md
  ARCHITECTURE.md
  UI_MIGRATION_NOTES.md
  CHANGELOG.md
  schema.sql
  LICENSE
  .streamlit/
    config.toml
  assets/
    journal-seal.png
    hero-classroom.jpg
    story-robotics.jpg
    story-debate.jpg
    story-culture.jpg
    story-football.jpg
    favicon.png
  journal_platform/
    ai.py
    config.py
    db.py
    document_io.py
    services.py
    ui.py
  data/
    seed_reviewers.csv
    sample_corpus.csv
  docs/
    AUTHOR_GUIDELINES.md
    REVIEWER_GUIDELINES.md
    EDITORIAL_POLICY.md
    COPYRIGHT_AND_LICENSE_GUIDE.md
    ROADMAP.md
    STREAMLIT_UI_PREVIEW.png
  tests/
    smoke_test.py
    ui_integration_test.py
    app_static_execution_test.py
  notebooks/
    high_school_journal_platform_colab.ipynb
  ui_design_reference/
    react_vite_prototype/
```

## Run locally

### Windows PowerShell

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python tests\smoke_test.py
python tests\ui_integration_test.py
python tests\app_static_execution_test.py
streamlit run app.py
```

### macOS or Linux

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python tests/smoke_test.py
python tests/ui_integration_test.py
python tests/app_static_execution_test.py
streamlit run app.py
```

The local app will normally open at `http://localhost:8501`.

Optional environment variables:

- `JOURNAL_DB_PATH` changes the SQLite database location.
- `JOURNAL_APP_URL` changes the base URL used in reviewer invitation links.
- `JOURNAL_GITHUB_URL` changes the repository link displayed in the interface.

## Deploy on Streamlit Community Cloud

1. Extract the ZIP and upload the contents of `african_high_school_journal_platform/` to the GitHub repository root.
2. In Streamlit Community Cloud, choose the GitHub repository.
3. Set the entrypoint to `app.py`.
4. Deploy. Dependencies are installed from `requirements.txt`.
5. Use **Manage app -> Reboot app** after replacing an older version.

The `ui_design_reference/` folder is a design archive. It does not change the Streamlit entrypoint and does not require Node.js during Streamlit deployment.

## Google Colab notebook

Open `notebooks/high_school_journal_platform_colab.ipynb` in Colab and run the cells from top to bottom. The notebook recreates the current Python/Streamlit project files, installs dependencies, runs the tests, and provides launch and ZIP-packaging cells.

## Important MVP limitations

This demonstration does **not** search the full internet or commercial scholarly databases for plagiarism. It compares text only with the local corpus available to this deployment. A production journal should integrate a licensed similarity or literature-search provider and establish human review and appeal procedures.

SQLite and local file storage are appropriate for an MVP, but Streamlit Community Cloud storage can be ephemeral and is not suitable as the only authoritative production database. A production release should use managed identity, a cloud database, object storage, encryption, backups, and audit logging.

## Required safeguards before real student use

Because many authors may be minors, a public production release should include:

- verified authentication and role-based authorization;
- guardian consent where legally or institutionally required;
- clear privacy, retention, deletion, and data-use policies;
- reviewer verification, confidentiality, and conflict-of-interest declarations;
- editorial standards for authorship, citation, research ethics, and corrections;
- moderation, abuse reporting, accessibility, monitoring, and incident response;
- human oversight of every AI-supported recommendation.

## Copyright and open-source note

The software is distributed under the MIT License. Individual student authors should retain copyright in their papers unless the journal adopts and clearly communicates a different publication license. The journal name, seal, website content, and brand assets may require separate trademark or copyright planning beyond the software license.
