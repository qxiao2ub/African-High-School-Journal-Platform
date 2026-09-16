from __future__ import annotations

import hashlib
from datetime import datetime
from html import escape

import pandas as pd
import streamlit as st

from journal_platform.ai import plagiarism_scan, word_count
from journal_platform.config import (
    ADVISOR_NAME,
    APP_NAME,
    APP_URL,
    ASSETS_DIR,
    AUTHOR_NAME,
    DB_PATH,
    FAVICON_PATH,
    GITHUB_URL,
    HERO_PATH,
    LOGO_PATH,
    PLAGIARISM_HIGH_THRESHOLD,
    PLAGIARISM_LOW_THRESHOLD,
    PUBLICATION_NAME,
)
from journal_platform.db import fetch_all, fetch_one, initialize_with_seed_data, upsert_user
from journal_platform.document_io import extract_text_from_bytes
from journal_platform.services import (
    add_review,
    get_assignments_for_reviewer,
    get_local_similarity_corpus,
    list_manuscripts,
    list_published,
    list_reviews,
    manuscript_quality_hints,
    manuscript_stats,
    publish_manuscript,
    save_draft,
    setup_platform,
    submit_manuscript,
    update_status,
)
from journal_platform.ui import (
    inject_theme,
    render_article_card,
    render_feature_grid,
    render_footer,
    render_hero,
    render_masthead,
    render_note,
    render_page_intro,
    render_section_heading,
    render_sidebar_brand,
    render_stats,
    render_tech_stack,
    render_workflow,
    status_badge_html,
)


st.set_page_config(
    page_title=APP_NAME,
    page_icon=str(FAVICON_PATH),
    layout="wide",
    initial_sidebar_state="expanded",
)
inject_theme()


RESEARCH_FIELDS = [
    "Agriculture and Food Security",
    "Biology",
    "Chemistry",
    "Computer Science",
    "Data Science",
    "Engineering",
    "Energy",
    "Environment",
    "Mathematics",
    "Physics",
    "Public Health",
    "Robotics",
    "Social Science",
    "Education",
    "Literature and Humanities",
    "Economics",
    "Entrepreneurship",
    "Other",
]

NAV_ITEMS = [
    "Home",
    "Published Library",
    "Submit / Write",
    "Reviewer Desk",
    "Editorial Office",
    "About",
]

STATUS_ORDER = [
    "draft",
    "submitted",
    "under_review",
    "minor_revision",
    "major_revision",
    "accepted",
    "rejected",
    "published",
]


@st.cache_resource
def bootstrap_database() -> str:
    initialize_with_seed_data(DB_PATH, reset=False)
    return str(DB_PATH)


bootstrap_database()


def manuscript_signature(text: str) -> str:
    return hashlib.sha256((text or "").encode("utf-8")).hexdigest()


def get_assignment_invite() -> dict | None:
    token = st.query_params.get("assignment_id")
    if isinstance(token, list):
        token = token[0] if token else ""
    token = str(token or "").strip()
    if not token or "-" not in token:
        return None
    left, right = token.split("-", 1)
    if not left.isdigit() or not right.isdigit():
        return None
    return fetch_one(
        DB_PATH,
        """
        SELECT a.*, m.title, m.abstract, m.field, m.keywords, m.manuscript_text,
               m.author_name, m.country, m.status AS manuscript_status,
               u.name AS reviewer_name, u.email AS reviewer_email
        FROM review_assignments a
        JOIN manuscripts m ON m.manuscript_id = a.manuscript_id
        JOIN users u ON u.user_id = a.reviewer_user_id
        WHERE a.manuscript_id = ? AND a.reviewer_user_id = ?
        """,
        (int(left), int(right)),
    )


def set_page(page: str) -> None:
    st.session_state["primary_nav"] = page


def show_status_badge(status: str) -> None:
    st.markdown(status_badge_html(status), unsafe_allow_html=True)


def show_similarity_result(result: dict) -> None:
    score = float(result.get("score", 0.0))
    risk = str(result.get("risk", "low")).upper()
    st.progress(min(max(score, 0.0), 1.0), text=f"Local similarity risk: {risk} ({score:.1%})")
    report = str(result.get("report", ""))
    if score >= PLAGIARISM_HIGH_THRESHOLD:
        st.error(report)
    elif score >= PLAGIARISM_LOW_THRESHOLD:
        st.warning(report)
    else:
        st.success(report)
    matches = result.get("matches") or []
    if matches:
        match_df = pd.DataFrame(matches).rename(
            columns={"title": "Source", "similarity": "Similarity", "source_type": "Source type", "url": "URL"}
        )
        if "Similarity" in match_df.columns:
            match_df["Similarity"] = match_df["Similarity"].map(lambda value: f"{float(value):.1%}")
        st.dataframe(match_df, hide_index=True, use_container_width=True)


def manuscript_download_text(paper: dict) -> str:
    return "\n".join(
        [
            str(paper.get("title") or "Untitled"),
            f"Author: {paper.get('author_name') or ''}",
            f"Country: {paper.get('country') or ''}",
            f"Field: {paper.get('field') or ''}",
            f"Keywords: {paper.get('keywords') or ''}",
            f"Publication slug: {paper.get('doi_slug') or ''}",
            "",
            "Abstract",
            str(paper.get("abstract") or ""),
            "",
            "Manuscript",
            str(paper.get("manuscript_text") or ""),
        ]
    )


invite = get_assignment_invite()
if "primary_nav" not in st.session_state:
    st.session_state["primary_nav"] = "Reviewer Desk" if invite else "Home"


with st.sidebar:
    render_sidebar_brand(LOGO_PATH, "African High School Journal")

    current_user = st.session_state.get("user", {})
    invite_role = "reviewer" if invite else str(current_user.get("role") or "student")
    role_index = ["student", "reviewer", "admin"].index(invite_role) if invite_role in {"student", "reviewer", "admin"} else 0

    st.markdown("### Demo profile")
    role = st.selectbox("Role", ["student", "reviewer", "admin"], index=role_index, key="profile_role")
    default_name = str(invite.get("reviewer_name") if invite else current_user.get("name") or "")
    default_email = str(invite.get("reviewer_email") if invite else current_user.get("email") or "")
    name = st.text_input("Name", value=default_name, key="profile_name")
    email = st.text_input("Email", value=default_email, key="profile_email")
    country = st.text_input("Country", value=str(current_user.get("country") or ""), key="profile_country")
    expertise = ""
    if role == "reviewer":
        expertise = st.text_area(
            "Reviewer expertise",
            value=str(current_user.get("expertise") or ""),
            placeholder="Example: renewable energy, electrical systems, engineering education",
            key="profile_expertise",
        )
    if st.button("Save demo profile", use_container_width=True, type="primary"):
        if not name.strip() or not email.strip():
            st.error("Please enter both a name and an email address.")
        else:
            user_id = upsert_user(
                DB_PATH,
                name.strip(),
                email.strip(),
                role,
                country=country.strip(),
                expertise=expertise.strip() or None,
            )
            st.session_state["user"] = {
                "user_id": user_id,
                "name": name.strip(),
                "email": email.strip().lower(),
                "role": role,
                "country": country.strip(),
                "expertise": expertise.strip(),
            }
            st.success(f"Profile saved for {name.strip()}.")

    st.divider()
    sidebar_stats = manuscript_stats(DB_PATH)
    st.metric("Published papers", sidebar_stats.get("published", 0))
    st.metric("Under review", sidebar_stats.get("under_review", 0))
    st.metric("Expert reviewers", sidebar_stats.get("reviewers", 0))

    st.divider()
    st.caption(f"Founder / Author: {AUTHOR_NAME}")
    st.caption(f"Advisor / Mentor: {ADVISOR_NAME}")
    st.caption("MVP demo: use production authentication, consent, privacy, moderation, and licensed similarity sources before real student deployment.")


render_masthead(
    LOGO_PATH,
    datetime.now().strftime("%A, %d %B %Y"),
    PUBLICATION_NAME,
    AUTHOR_NAME,
    ADVISOR_NAME,
)

selected_page = st.radio(
    "Primary navigation",
    NAV_ITEMS,
    horizontal=True,
    label_visibility="collapsed",
    key="primary_nav",
)


def page_home() -> None:
    render_hero(HERO_PATH)

    cta_a, cta_b, cta_c, cta_d = st.columns([1.15, 1.15, 1.15, 1.8])
    with cta_a:
        st.button(
            "Submit a manuscript",
            key="home_submit",
            type="primary",
            use_container_width=True,
            on_click=set_page,
            args=("Submit / Write",),
        )
    with cta_b:
        st.button(
            "Browse publications",
            key="home_library",
            use_container_width=True,
            on_click=set_page,
            args=("Published Library",),
        )
    with cta_c:
        st.button(
            "Become a reviewer",
            key="home_reviewer",
            use_container_width=True,
            on_click=set_page,
            args=("Reviewer Desk",),
        )
    with cta_d:
        st.caption("Electronic-first publishing now. Print partnerships can be explored as the journal grows.")

    stats = manuscript_stats(DB_PATH)
    render_stats(
        [
            ("Published papers", stats.get("published", 0)),
            ("Active reviewers", stats.get("reviewers", 0)),
            ("Student authors", stats.get("students", 0)),
            ("In editorial workflow", stats.get("under_review", 0) + stats.get("submitted", 0)),
        ]
    )

    render_section_heading(
        "From classroom question to citable work",
        "A complete student journal workflow",
        "The platform combines research writing, responsible AI assistance, expert feedback, revision, and electronic publication.",
    )
    render_workflow()

    render_section_heading(
        "Research across Africa",
        "Ideas, inquiry, and student leadership",
        "The migrated UI uses the supplied editorial design, imagery, seal, typography, and newspaper-inspired visual language.",
    )
    story_columns = st.columns(4)
    stories = [
        ("story-robotics.jpg", "Science and engineering", "Prototype, test, measure, and communicate solutions for real community needs."),
        ("story-debate.jpg", "Policy and social inquiry", "Build evidence-based arguments about education, economics, governance, and society."),
        ("story-culture.jpg", "Culture and humanities", "Document language, heritage, literature, arts, identity, and lived experience."),
        ("story-football.jpg", "Health and human performance", "Study sport, wellness, teamwork, psychology, public health, and youth development."),
    ]
    for column, (image_name, title, description) in zip(story_columns, stories):
        with column:
            st.image(str(ASSETS_DIR / image_name), use_container_width=True)
            st.markdown(f"#### {title}")
            st.caption(description)

    published = list_published(DB_PATH)
    render_section_heading(
        "Open electronic journal",
        "Latest published student research",
        "Accepted manuscripts become searchable publications with structured metadata and stable journal slugs.",
    )
    if published:
        preview_columns = st.columns(min(3, len(published)))
        for column, paper in zip(preview_columns, published[:3]):
            with column:
                render_article_card(paper)
        st.button(
            "View the complete library",
            key="home_view_all",
            use_container_width=True,
            on_click=set_page,
            args=("Published Library",),
        )
    else:
        render_note(
            "The publication library is ready for its first accepted student paper. Submit a manuscript, complete peer review, and use the Editorial Office to publish it electronically."
        )

    render_section_heading(
        "Responsible innovation",
        "AI and data science at the core",
        "Every automated result is designed to support human judgment, not replace teachers, reviewers, or editors.",
    )
    render_feature_grid()

    render_section_heading(
        "Subjects welcomed",
        "A multidisciplinary home for student research",
        "Projects may be experimental, computational, theoretical, social, literary, environmental, entrepreneurial, or interdisciplinary.",
    )
    render_tech_stack(RESEARCH_FIELDS[:-1] + ["Interdisciplinary research"])


def page_library() -> None:
    render_page_intro(
        "Open electronic publication",
        "Published Research Library",
        "Search, read, and download peer-reviewed high school research published through the platform.",
    )

    search_col, field_col = st.columns([2.2, 1])
    with search_col:
        query = st.text_input(
            "Search title, abstract, author, country, or keywords",
            key="library_search",
            placeholder="Example: solar energy, robotics, public health, Ghana",
        )
    all_papers = list_published(DB_PATH, query=query)
    available_fields = sorted({str(paper.get("field") or "Other") for paper in all_papers})
    with field_col:
        selected_field = st.selectbox("Research field", ["All fields"] + available_fields, key="library_field")
    papers = all_papers if selected_field == "All fields" else [p for p in all_papers if p.get("field") == selected_field]

    render_stats(
        [
            ("Search results", len(papers)),
            ("Fields represented", len({p.get("field") for p in papers})),
            ("Countries represented", len({p.get("country") for p in papers if p.get("country")})),
            ("Access model", "Open"),
        ]
    )

    if not papers:
        render_note(
            "No published paper matches this search yet. The platform is operational; accepted manuscripts can be published from the Editorial Office."
        )
        render_section_heading(
            "Explore the mission",
            "Research themes the journal welcomes",
            "These visual themes come from the supplied UI design and illustrate the breadth of student work the platform can host.",
        )
        fallback_cols = st.columns(3)
        fallback = [
            ("story-robotics.jpg", "Technology for local impact"),
            ("story-culture.jpg", "African culture, language, and identity"),
            ("story-debate.jpg", "Youth perspectives on society and policy"),
        ]
        for column, (image_name, title) in zip(fallback_cols, fallback):
            with column:
                st.image(str(ASSETS_DIR / image_name), use_container_width=True)
                st.markdown(f"#### {title}")
        return

    for start in range(0, len(papers), 2):
        columns = st.columns(2)
        for offset, column in enumerate(columns):
            index = start + offset
            if index >= len(papers):
                continue
            paper = papers[index]
            manuscript_id = int(paper["manuscript_id"])
            with column:
                render_article_card(paper)
                with st.expander("Read full publication"):
                    st.markdown(f"**Author:** {paper.get('author_name') or 'Unknown'}")
                    st.markdown(f"**Country:** {paper.get('country') or 'Not provided'}")
                    st.markdown(f"**Field:** {paper.get('field') or 'Not provided'}")
                    st.markdown(f"**Keywords:** {paper.get('keywords') or 'Not provided'}")
                    st.markdown(f"**Publication slug:** `{paper.get('doi_slug') or ''}`")
                    st.markdown("#### Abstract")
                    st.write(paper.get("abstract") or "No abstract was provided.")
                    st.markdown("#### Manuscript")
                    st.write(paper.get("manuscript_text") or "")
                    st.download_button(
                        "Download plain-text publication",
                        data=manuscript_download_text(paper).encode("utf-8"),
                        file_name=f"{paper.get('doi_slug') or f'paper-{manuscript_id}'}.txt",
                        mime="text/plain",
                        key=f"download_paper_{manuscript_id}",
                        use_container_width=True,
                    )


def page_submit() -> None:
    render_page_intro(
        "Student author workspace",
        "Write, Check, and Submit Your Research",
        "Upload a manuscript or write directly online, receive transparent AI-assisted feedback, save a draft, and submit for expert review.",
    )
    render_note(
        "AI assistance is educational support. The similarity result is not a plagiarism verdict, and students should review sources, citations, permissions, and school policies with a teacher."
    )

    current_user = st.session_state.get("user", {})
    left, right = st.columns([1.05, 1])
    with left:
        st.markdown("### Author and manuscript details")
        student_name = st.text_input(
            "Student author name",
            value=str(current_user.get("name") or ""),
            key="student_name",
        )
        student_email = st.text_input(
            "Student email",
            value=str(current_user.get("email") or ""),
            key="student_email",
        )
        student_country = st.text_input(
            "Country",
            value=str(current_user.get("country") or ""),
            key="student_country",
        )
        title = st.text_input("Manuscript title", key="manuscript_title")
        field = st.selectbox("Research field", RESEARCH_FIELDS, key="manuscript_field")
        keywords = st.text_input(
            "Keywords",
            key="manuscript_keywords",
            placeholder="Comma-separated: solar energy, voltage, school laboratory",
        )

    with right:
        st.markdown("### Abstract and file upload")
        abstract = st.text_area(
            "Abstract",
            height=190,
            key="manuscript_abstract",
            placeholder="Summarize the research question, methods, main result, and significance.",
        )
        uploaded_file = st.file_uploader(
            "Upload DOCX, PDF, Markdown, or text",
            type=["txt", "md", "markdown", "pdf", "docx"],
            key="manuscript_upload",
        )
        if uploaded_file is not None:
            file_signature = f"{uploaded_file.name}:{uploaded_file.size}"
            if st.session_state.get("loaded_file_signature") != file_signature:
                try:
                    extracted = extract_text_from_bytes(uploaded_file.getvalue(), uploaded_file.name)
                    st.session_state["manuscript_body"] = extracted
                    st.session_state["loaded_file_signature"] = file_signature
                    st.session_state["loaded_file_name"] = uploaded_file.name
                    st.success(f"Loaded {word_count(extracted):,} words from {uploaded_file.name}.")
                except Exception as exc:
                    st.error(f"Could not read the uploaded file: {exc}")

    st.markdown("### Online manuscript studio")
    manuscript_text = st.text_area(
        "Full manuscript",
        height=520,
        key="manuscript_body",
        placeholder=(
            "Suggested structure:\n\n"
            "Title\nAbstract\nIntroduction\nResearch question or hypothesis\nMethods\nResults\nDiscussion\nConclusion\nReferences"
        ),
    )
    file_name = str(st.session_state.get("loaded_file_name") or "online-editor")
    current_words = word_count(manuscript_text)
    st.caption(f"Current manuscript length: {current_words:,} words | Source: {file_name}")

    hints = manuscript_quality_hints(manuscript_text) if manuscript_text.strip() else []
    if hints:
        with st.expander("AI writing and structure coach", expanded=False):
            for hint in hints:
                st.write(f"- {hint}")

    scan_col, scan_info = st.columns([1, 2.2])
    with scan_col:
        run_scan = st.button(
            "Run AI similarity screen",
            key="run_similarity_scan",
            type="primary",
            use_container_width=True,
        )
    with scan_info:
        st.caption(
            "The MVP compares the manuscript with the local seed corpus and manuscripts already submitted to this deployment. A production journal should add a licensed external source."
        )

    if run_scan:
        if current_words < 50:
            st.warning("Add at least 50 words before running the similarity screen.")
        else:
            corpus = get_local_similarity_corpus(DB_PATH)
            result = plagiarism_scan(manuscript_text, corpus, top_n=5)
            st.session_state["last_scan"] = result
            st.session_state["last_scan_signature"] = manuscript_signature(manuscript_text)

    scan_is_current = (
        st.session_state.get("last_scan_signature") == manuscript_signature(manuscript_text)
        and isinstance(st.session_state.get("last_scan"), dict)
    )
    if scan_is_current:
        show_similarity_result(st.session_state["last_scan"])
    elif st.session_state.get("last_scan"):
        st.info("The manuscript changed after the previous similarity screen. Run the screen again for a current result.")

    save_col, submit_col = st.columns(2)
    required_values = [student_name.strip(), student_email.strip(), title.strip(), field.strip(), manuscript_text.strip()]
    with save_col:
        save_clicked = st.button("Save as online draft", key="save_online_draft", use_container_width=True)
    with submit_col:
        submit_clicked = st.button(
            "Submit for expert review",
            key="submit_for_review",
            type="primary",
            use_container_width=True,
        )

    if save_clicked:
        if not all(required_values):
            st.error("Complete author name, email, title, field, and manuscript text before saving.")
        else:
            manuscript_id = save_draft(
                DB_PATH,
                student_name.strip(),
                student_email.strip(),
                student_country.strip(),
                title.strip(),
                abstract.strip(),
                field,
                keywords.strip(),
                manuscript_text,
                file_name=file_name,
            )
            st.success(f"Draft saved successfully. Manuscript ID: {manuscript_id}")

    if submit_clicked:
        if not all(required_values):
            st.error("Complete author name, email, title, field, and manuscript text before submitting.")
        elif current_words < 100:
            st.error("The manuscript is too short for review. Add at least 100 words for this MVP submission.")
        else:
            current_scan = st.session_state.get("last_scan") if scan_is_current else None
            result = submit_manuscript(
                DB_PATH,
                student_name.strip(),
                student_email.strip(),
                student_country.strip(),
                title.strip(),
                abstract.strip(),
                field,
                keywords.strip(),
                manuscript_text,
                file_name=file_name,
                plagiarism_override=current_scan,
            )
            st.success(
                f"Manuscript {result['manuscript_id']} was submitted and moved into the reviewer-matching workflow."
            )
            show_similarity_result(result["plagiarism"])
            if result["assignments"]:
                st.markdown("#### AI-recommended reviewer assignments")
                assignments_df = pd.DataFrame(result["assignments"])
                visible_columns = ["name", "email", "country", "expertise", "match_score", "assignment_link"]
                assignments_df = assignments_df[[column for column in visible_columns if column in assignments_df.columns]]
                if "match_score" in assignments_df.columns:
                    assignments_df["match_score"] = assignments_df["match_score"].map(lambda value: f"{float(value):.1%}")
                st.dataframe(assignments_df, hide_index=True, use_container_width=True)
            else:
                st.warning("No reviewer could be matched. Add reviewer expertise profiles in the Editorial Office.")

    if student_email.strip():
        with st.expander("Track manuscripts for this email", expanded=False):
            records = fetch_all(
                DB_PATH,
                """
                SELECT m.manuscript_id, m.title, m.field, m.status, m.updated_at, m.doi_slug
                FROM manuscripts m
                JOIN users u ON u.user_id = m.author_user_id
                WHERE lower(u.email) = lower(?)
                ORDER BY m.updated_at DESC
                """,
                (student_email.strip(),),
            )
            if records:
                st.dataframe(pd.DataFrame(records), hide_index=True, use_container_width=True)
            else:
                st.caption("No saved drafts or submissions were found for this email.")


def page_reviewer() -> None:
    render_page_intro(
        "Faculty and teacher peer review",
        "Reviewer Desk",
        "Read assigned student manuscripts, provide constructive feedback, and recommend acceptance, revision, or rejection.",
    )
    render_note(
        "Reviewers should protect student privacy, avoid conflicts of interest, focus on age-appropriate scholarly development, and never use confidential manuscripts for other purposes."
    )

    current_user = st.session_state.get("user", {})
    invite_email = str(invite.get("reviewer_email") or "") if invite else ""
    invite_name = str(invite.get("reviewer_name") or "") if invite else ""
    identity_col, count_col = st.columns([2.2, 1])
    with identity_col:
        reviewer_email = st.text_input(
            "Reviewer email",
            value=invite_email or str(current_user.get("email") or ""),
            key="reviewer_email",
        )
        reviewer_name = st.text_input(
            "Reviewer name",
            value=invite_name or str(current_user.get("name") or ""),
            key="reviewer_name",
        )
    assignments = get_assignments_for_reviewer(DB_PATH, reviewer_email) if reviewer_email.strip() else []
    with count_col:
        st.metric("Assigned manuscripts", len(assignments))
        st.metric("Invite link detected", "Yes" if invite else "No")

    if not reviewer_email.strip():
        st.info("Enter the email address used for the reviewer assignment.")
        return
    if not assignments:
        st.warning("No assignments were found for this email. An editor can add reviewer expertise and submit a manuscript to trigger AI matching.")
        return

    for assignment in assignments:
        assignment_id = int(assignment["assignment_id"])
        manuscript_id = int(assignment["manuscript_id"])
        safe_title = escape(str(assignment.get("title") or "Untitled manuscript"))
        safe_abstract = escape(str(assignment.get("abstract") or "No abstract was provided."))
        safe_author = escape(str(assignment.get("author_name") or "Unknown"))
        safe_country = escape(str(assignment.get("country") or "Country not provided"))
        st.markdown(
            f"""
            <div class="article-card">
              <div class="meta">Reviewer assignment &nbsp; | &nbsp; Match score {float(assignment['match_score']):.1%}</div>
              <h3>{safe_title}</h3>
              <p>{safe_abstract}</p>
              <div class="byline">Student author: {safe_author} &middot; {safe_country}</div>
              <div style="margin-top:0.65rem;">{status_badge_html(str(assignment.get('manuscript_status') or 'under_review'))}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        with st.expander(f"Open manuscript and review form - assignment {assignment_id}"):
            manuscript_tab, review_tab = st.tabs(["Manuscript", "Submit review"])
            with manuscript_tab:
                st.markdown(f"**Field:** {assignment.get('field') or ''}")
                st.markdown(f"**Keywords:** {assignment.get('keywords') or ''}")
                st.markdown("#### Abstract")
                st.write(assignment.get("abstract") or "")
                st.markdown("#### Full manuscript")
                st.text_area(
                    "Read-only manuscript",
                    value=str(assignment.get("manuscript_text") or ""),
                    height=480,
                    disabled=True,
                    key=f"read_manuscript_{assignment_id}",
                )
            with review_tab:
                with st.form(f"review_form_{assignment_id}"):
                    recommendation = st.selectbox(
                        "Editorial recommendation",
                        ["accept", "minor_revision", "major_revision", "reject"],
                        format_func=lambda value: value.replace("_", " ").title(),
                    )
                    comments_author = st.text_area(
                        "Comments to the student author",
                        height=220,
                        placeholder="Identify strengths, explain concerns, and give specific revision guidance.",
                    )
                    comments_editor = st.text_area(
                        "Confidential comments to the editor",
                        height=130,
                        placeholder="Optional: conflicts, ethical concerns, or confidential editorial context.",
                    )
                    confidence = st.slider("Reviewer confidence", 1, 5, 3)
                    certify = st.checkbox(
                        "I confirm that this review is constructive, confidential, and free of known conflicts of interest."
                    )
                    submitted = st.form_submit_button("Submit peer review", type="primary", use_container_width=True)
                if submitted:
                    if not reviewer_name.strip() or not reviewer_email.strip() or not comments_author.strip():
                        st.error("Reviewer name, email, and comments to the author are required.")
                    elif not certify:
                        st.error("Confirm the reviewer ethics statement before submitting.")
                    else:
                        review_id = add_review(
                            DB_PATH,
                            manuscript_id,
                            reviewer_name.strip(),
                            reviewer_email.strip(),
                            recommendation,
                            comments_author.strip(),
                            comments_editor.strip(),
                            confidence,
                        )
                        st.success(f"Review submitted successfully. Review ID: {review_id}")


def page_admin() -> None:
    render_page_intro(
        "Editorial workflow control center",
        "Editorial Office",
        "Manage reviewers, monitor manuscript status, inspect AI reports, record decisions, publish accepted work, and export platform data.",
    )
    st.warning("This MVP editorial area is intentionally open for demonstration. Add role-based authentication and authorization before public production use.")

    stats = manuscript_stats(DB_PATH)
    render_stats(
        [
            ("All manuscripts", sum(int(stats.get(status, 0)) for status in STATUS_ORDER)),
            ("Under review", stats.get("under_review", 0)),
            ("Accepted", stats.get("accepted", 0)),
            ("Published", stats.get("published", 0)),
        ]
    )

    overview_tab, reviewer_tab, manuscript_tab, export_tab = st.tabs(
        ["Workflow overview", "Reviewer directory", "Manuscript management", "Data export"]
    )

    with overview_tab:
        if st.button("Initialize or refresh seed reviewers and sample corpus", key="seed_platform"):
            seeded = setup_platform(DB_PATH, reset=False)
            st.success(f"Seed complete: {seeded}")
        pipeline_rows = [{"Status": status.replace("_", " ").title(), "Count": int(stats.get(status, 0))} for status in STATUS_ORDER]
        pipeline_df = pd.DataFrame(pipeline_rows).set_index("Status")
        st.markdown("### Manuscript pipeline")
        st.bar_chart(pipeline_df)
        st.dataframe(pipeline_df.reset_index(), hide_index=True, use_container_width=True)

    with reviewer_tab:
        st.markdown("### Add or update a reviewer")
        with st.form("admin_add_reviewer"):
            r_name = st.text_input("Reviewer full name")
            r_email = st.text_input("Reviewer email")
            r_country = st.text_input("Reviewer country")
            r_expertise = st.text_area(
                "Expertise profile",
                height=140,
                placeholder="Fields, methods, age groups, regional expertise, and relevant teaching or research experience.",
            )
            reviewer_saved = st.form_submit_button("Save reviewer profile", type="primary", use_container_width=True)
        if reviewer_saved:
            if r_name.strip() and r_email.strip() and r_expertise.strip():
                upsert_user(
                    DB_PATH,
                    r_name.strip(),
                    r_email.strip(),
                    "reviewer",
                    country=r_country.strip(),
                    expertise=r_expertise.strip(),
                )
                st.success("Reviewer profile saved.")
            else:
                st.error("Name, email, and expertise are required.")

        reviewers = fetch_all(
            DB_PATH,
            "SELECT user_id, name, email, country, expertise, created_at FROM users WHERE role = 'reviewer' ORDER BY name",
        )
        if reviewers:
            st.markdown("### Current reviewer directory")
            st.dataframe(pd.DataFrame(reviewers), hide_index=True, use_container_width=True)

    manuscripts = list_manuscripts(DB_PATH)
    with manuscript_tab:
        if not manuscripts:
            st.info("No manuscripts have been saved or submitted yet.")
        else:
            display_df = pd.DataFrame(manuscripts)
            visible = [
                "manuscript_id",
                "title",
                "author_name",
                "country",
                "field",
                "status",
                "plagiarism_score",
                "matched_reviewers",
                "updated_at",
            ]
            st.dataframe(display_df[[column for column in visible if column in display_df.columns]], hide_index=True, use_container_width=True)

            manuscript_options = {int(row["manuscript_id"]): f"#{row['manuscript_id']} - {row['title']}" for row in manuscripts}
            selected_id = st.selectbox(
                "Select a manuscript to manage",
                list(manuscript_options),
                format_func=lambda manuscript_id: manuscript_options[manuscript_id],
                key="admin_selected_manuscript",
            )
            manuscript = fetch_one(DB_PATH, "SELECT * FROM manuscripts WHERE manuscript_id = ?", (int(selected_id),))
            if manuscript:
                st.markdown(f"### {manuscript['title']}")
                show_status_badge(str(manuscript["status"]))
                metadata_a, metadata_b, metadata_c = st.columns(3)
                metadata_a.metric("Similarity score", f"{float(manuscript.get('plagiarism_score') or 0):.1%}")
                metadata_b.metric("Field", manuscript.get("field") or "Not set")
                metadata_c.metric("Country", manuscript.get("country") or "Not set")

                with st.expander("Similarity and reviewer matching reports"):
                    st.markdown("#### Similarity report")
                    st.text(manuscript.get("plagiarism_report") or "No report stored.")
                    st.markdown("#### Matched reviewers")
                    st.write(manuscript.get("matched_reviewers") or "No matches stored.")

                reviews = list_reviews(DB_PATH, int(selected_id))
                if reviews:
                    st.markdown("#### Submitted reviews")
                    review_df = pd.DataFrame(reviews)
                    review_columns = [
                        "reviewer_name",
                        "recommendation",
                        "confidence",
                        "comments_to_author",
                        "comments_to_editor",
                        "created_at",
                    ]
                    st.dataframe(review_df[[column for column in review_columns if column in review_df.columns]], hide_index=True, use_container_width=True)

                status_col, action_col = st.columns([1.4, 1])
                with status_col:
                    current_status = str(manuscript["status"])
                    new_status = st.selectbox(
                        "Set editorial status",
                        STATUS_ORDER,
                        index=STATUS_ORDER.index(current_status),
                        format_func=lambda value: value.replace("_", " ").title(),
                        key=f"admin_status_{selected_id}",
                    )
                    if st.button("Update editorial status", key=f"update_status_{selected_id}", use_container_width=True):
                        update_status(DB_PATH, int(selected_id), new_status)
                        st.success("Editorial status updated.")
                with action_col:
                    st.caption("Publication is recommended only after review and acceptance.")
                    if st.button(
                        "Publish electronically",
                        key=f"publish_{selected_id}",
                        type="primary",
                        use_container_width=True,
                    ):
                        slug = publish_manuscript(DB_PATH, int(selected_id))
                        st.success(f"Publication released with slug: {slug}")

    with export_tab:
        st.markdown("### Export editorial records")
        if manuscripts:
            st.download_button(
                "Download manuscript CSV",
                pd.DataFrame(manuscripts).to_csv(index=False).encode("utf-8"),
                file_name="african_high_school_journal_manuscripts.csv",
                mime="text/csv",
                use_container_width=True,
            )
        reviewers = fetch_all(DB_PATH, "SELECT * FROM users WHERE role = 'reviewer' ORDER BY name")
        if reviewers:
            st.download_button(
                "Download reviewer directory CSV",
                pd.DataFrame(reviewers).to_csv(index=False).encode("utf-8"),
                file_name="african_high_school_journal_reviewers.csv",
                mime="text/csv",
                use_container_width=True,
            )


def page_about() -> None:
    render_page_intro(
        "Mission, governance, and technology",
        "About the Journal Platform",
        "A GitHub-open-source MVP created to help African high school students experience responsible research, expert review, revision, and electronic publication.",
    )

    mission_col, identity_col = st.columns([1.45, 1])
    with mission_col:
        st.markdown("### Mission")
        st.write(
            "The platform is designed to expand access to research mentorship and publication literacy for African high school students. It gives students a structured place to write or upload original work, receive AI-assisted integrity feedback, connect with qualified reviewers, revise thoughtfully, and share accepted research with a global audience."
        )
        st.markdown("### Electronic-first publishing")
        st.write(
            "The current model publishes electronic articles. A future print edition may be explored with professional printing or publishing partners after readership, editorial capacity, funding, and quality assurance mature."
        )
        st.markdown("### Leadership")
        st.markdown(f"**Founder / Author / Main Builder:** {AUTHOR_NAME}")
        st.markdown(f"**Advisor / Mentor:** {ADVISOR_NAME}")
    with identity_col:
        st.image(str(LOGO_PATH), caption="Official journal platform seal", use_container_width=True)

    render_section_heading(
        "Migrated design system",
        "From React prototype to launchable Streamlit experience",
        "The supplied Lovable/Vite/React UI was translated into Streamlit components and custom CSS while preserving the Python journal workflow.",
    )
    render_feature_grid()

    render_section_heading(
        "Technology architecture",
        "Modular, testable, and GitHub-ready",
        "The application can launch directly from app.py on Streamlit Community Cloud.",
    )
    render_tech_stack(
        [
            "Python",
            "Streamlit",
            "SQLite",
            "pandas",
            "NumPy",
            "scikit-learn",
            "TF-IDF",
            "Cosine similarity",
            "PDF extraction",
            "DOCX extraction",
            "GitHub",
            "Google Colab notebook",
            "Automated smoke tests",
        ]
    )
    st.code(
        "Student browser -> Streamlit UI -> Python services -> SQLite database\n"
        "                                  -> AI similarity engine\n"
        "                                  -> AI reviewer matcher\n"
        "                                  -> Review and publication workflow",
        language="text",
    )

    render_section_heading(
        "Responsible deployment",
        "Safeguards required before real student use",
        "Because many authors may be minors, production governance is as important as the software.",
    )
    safeguards = [
        "Verified authentication and role-based authorization for students, reviewers, editors, and administrators.",
        "Guardian consent where required, age-appropriate terms, privacy notices, data retention rules, and secure cloud storage.",
        "Reviewer identity verification, conflict-of-interest declarations, confidentiality, and anti-harassment rules.",
        "Licensed plagiarism or literature-search sources, appeal procedures, human review, and transparent AI limitations.",
        "Editorial standards for authorship, citations, research ethics, human subjects, dangerous experiments, and corrections.",
        "Moderation, abuse reporting, accessibility, backups, monitoring, and incident response.",
    ]
    for safeguard in safeguards:
        st.write(f"- {safeguard}")

    render_note(
        "The AI similarity scanner and reviewer matcher are assistive tools. Teachers, reviewers, and editors retain final responsibility for academic and publication decisions."
    )
    st.markdown(f"**GitHub source:** {GITHUB_URL}")
    st.markdown(f"**Live application:** {APP_URL}")


PAGE_RENDERERS = {
    "Home": page_home,
    "Published Library": page_library,
    "Submit / Write": page_submit,
    "Reviewer Desk": page_reviewer,
    "Editorial Office": page_admin,
    "About": page_about,
}

PAGE_RENDERERS[selected_page]()
render_footer(AUTHOR_NAME, ADVISOR_NAME, GITHUB_URL, APP_URL)
