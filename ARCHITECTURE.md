# Architecture and Data Schema

**Founder / Author / Main Builder:** Kavya Kaushal Shah  
**Advisor / Mentor:** Dr. Qingyang Xiao

## Purpose

The African High School Journal Platform is an electronic-first publication workflow for African high school researchers. It combines a professional journal-style Streamlit interface with manuscript management, transparent AI assistance, expert peer review, editorial decisions, and a public research library.

## System architecture

```text
Student / Reviewer / Editor browser
                |
                v
     Streamlit presentation layer
       app.py + journal_platform/ui.py
                |
                v
        Python service layer
     journal_platform/services.py
        /          |           \
       v           v            v
 AI similarity  Reviewer     Document text
 and matching   workflow      extraction
     ai.py       services.py   document_io.py
        \          |           /
         \         v          /
          ---- SQLite data ----
              db.py + schema.sql
```

## Presentation layer

`app.py` provides six responsive workspaces:

1. Home and mission landing page
2. Published Research Library
3. Student Submit / Write workspace
4. Reviewer Desk
5. Editorial Office
6. About, governance, and technology

`journal_platform/ui.py` implements the migrated design system from the supplied React prototype:

- masthead and seal;
- responsive newspaper-inspired navigation;
- classroom hero banner;
- publication, workflow, feature, status, and metric cards;
- navy, cream, gold, and teal theme;
- responsive mobile layouts;
- professional footer and external links.

The original Vite/React source is archived in `ui_design_reference/react_vite_prototype/`. It is not executed by Streamlit.

## Service layer

`journal_platform/services.py` coordinates:

- draft storage;
- submission creation and manuscript versioning;
- local similarity scanning;
- reviewer ranking and assignment creation;
- peer-review storage;
- status transitions;
- electronic publication;
- manuscript and reviewer reporting.

## AI and data-science layer

### Local similarity screening

1. Normalize candidate and corpus text.
2. Build unigram and bigram TF-IDF vectors.
3. Compute cosine similarity between the candidate and each local source.
4. Return the highest score, risk band, and ranked source matches.
5. Label the result as an assistive screen rather than an academic-misconduct decision.

The MVP corpus includes seed texts and manuscripts already stored in the deployment. It does not represent an internet-wide or commercial plagiarism check.

### Reviewer matching

1. Concatenate manuscript title, abstract, field, keywords, and full text.
2. Vectorize the manuscript profile and reviewer expertise profiles.
3. Calculate cosine similarity.
4. Apply a small field-match bonus.
5. Rank the top reviewers and store assignment records with invite links.

Human editors remain responsible for reviewer suitability, conflicts of interest, workload, and final assignment decisions.

## Data entities

### `users`

Stores students, reviewers, and administrators. Reviewer records include expertise text used by the matching model.

### `manuscripts`

Stores metadata, author information, text, workflow status, local similarity summary, reviewer-match summary, timestamps, and publication slug.

Supported status values:

- `draft`
- `submitted`
- `under_review`
- `minor_revision`
- `major_revision`
- `accepted`
- `rejected`
- `published`

### `manuscript_versions`

Stores draft and submission snapshots to support future revision history.

### `plagiarism_sources`

Stores local comparison texts and optional URLs.

### `review_assignments`

Stores AI-ranked reviewer assignments, match scores, invitation state, and assignment links.

### `reviews`

Stores reviewer recommendations, comments to authors, confidential comments to editors, confidence, and timestamps.

## End-to-end workflow

1. A student creates a demo profile.
2. The student uploads a file or writes in the online studio.
3. The platform extracts text and provides structure hints.
4. The student runs a local similarity screen.
5. The student saves a draft or submits the manuscript.
6. The AI matcher ranks reviewers by expertise.
7. Reviewers open the Reviewer Desk and submit structured feedback.
8. An editor inspects reports and reviews, then records a decision.
9. Accepted work is published in the searchable electronic library.
10. Editors export records for reporting and backup.

## Deployment model

### MVP

- Streamlit Community Cloud
- GitHub source repository
- SQLite database
- local static assets
- no external secrets required

### Production target

- managed identity provider;
- role-based access control;
- PostgreSQL or another managed relational database;
- cloud object storage for source manuscripts;
- transactional email or notification service;
- licensed similarity or scholarly search integration;
- monitoring, backups, audit logs, and disaster recovery.

## Safety, privacy, and governance

This repository is a demonstration and is not production-secure. Before real student use, implement verified accounts, youth-safety policies, guardian consent where required, secure communications, privacy and retention controls, conflict-of-interest review, accessibility, content moderation, research ethics standards, and independent editorial governance.
