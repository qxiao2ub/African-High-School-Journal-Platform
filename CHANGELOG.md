# Changelog

## 0.2.2 - Streamlit fixed-header safe-area repair (2026-09-19)

- Reserved responsive vertical clearance for Streamlit Community Cloud's fixed top toolbar.
- Added current and legacy Streamlit block-container selectors for deployment compatibility.
- Added mobile safe-area handling for narrow screens and devices with display cutouts.
- Preserved the complete date strip, journal masthead, founder/advisor credits, and navigation above every page.
- Added `tests/top_header_layout_regression_test.py` to prevent future top-overlap regressions.

## 0.2.1 - Streamlit card-grid rendering repair (2026-09-19)

- Fixed the Home-page workflow section so all five cards render instead of exposing later `<div>` tags as code.
- Fixed the Home and About feature sections so all six AI and platform cards render correctly.
- Replaced indented, blank-line-separated repeated HTML with compact uninterrupted markup that remains inside Streamlit's raw-HTML block.
- Added `tests/html_grid_regression_test.py` to verify card counts and prevent the Markdown parser regression from returning.
- Re-ran the service smoke test, UI integration test, six-page static execution test, Python compilation, and CommonMark rendering check.
- Regenerated the embedded Google Colab project archive and GitHub-ready ZIP.

## 0.2.0 - Streamlit UI integration

- Migrated the supplied Vite/React journal design into the Streamlit application.
- Added the official journal seal, classroom hero image, story imagery, and favicon.
- Added a newspaper-inspired masthead, responsive navigation, publication cards, workflow cards, feature panels, status badges, and footer.
- Reorganized the application into Home, Published Library, Submit / Write, Reviewer Desk, Editorial Office, and About workspaces.
- Added student submission tracking, reviewer ethics confirmation, editorial pipeline visualization, and publication downloads.
- Changed reviewer assignment links from relative tokens to complete live-app URLs.
- Expanded publication search to include country and research field.
- Preserved the original React UI source in `ui_design_reference/`.
- Added UI integration and static application execution tests.
- Regenerated the self-contained Google Colab notebook.

## 0.1.0 - Initial MVP

- Added manuscript upload and online drafting.
- Added local TF-IDF similarity screening.
- Added AI-assisted reviewer matching.
- Added reviewer comments and recommendations.
- Added editorial status management and electronic publication.
- Added SQLite schema, seed data, documentation, and service smoke test.
