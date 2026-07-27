from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
import streamlit as st

from journal_platform.ai import plagiarism_scan, word_count
from journal_platform.config import APP_NAME, APP_TAGLINE, DB_PATH, PLAGIARISM_HIGH_THRESHOLD, PLAGIARISM_LOW_THRESHOLD
from journal_platform.db import execute, fetch_all, fetch_one, initialize_with_seed_data, upsert_user
from journal_platform.document_io import read_uploaded_file
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

st.set_page_config(page_title=APP_NAME, page_icon="📚", layout="wide")


@st.cache_resource
def bootstrap_database() -> str:
    initialize_with_seed_data(DB_PATH, reset=False)
    return str(DB_PATH)


bootstrap_database()


def show_status_badge(status: str) -> None:
    status = status or "unknown"
    icon = {
        "draft": "📝",
        "submitted": "📨",
        "under_review": "🔍",
        "minor_revision": "🟡",
        "major_revision": "🟠",
        "accepted": "✅",
        "rejected": "❌",
        "published": "🌍",
    }.get(status, "•")
    st.caption(f"{icon} Status: `{status}`")


def risk_box(score: float, report: str) -> None:
    if score >= PLAGIARISM_HIGH_THRESHOLD:
        st.error(report)
    elif score >= PLAGIARISM_LOW_THRESHOLD:
        st.warning(report)
    else:
        st.success(report)


with st.sidebar:
    st.title("Journal login")
    role = st.selectbox("Role", ["student", "reviewer", "admin"])
    name = st.text_input("Name", value="Kavya" if role == "admin" else "")
    email = st.text_input("Email", value="kavya@example.org" if role == "admin" else "")
    country = st.text_input("Country", value="")
    expertise = ""
    if role == "reviewer":
        expertise = st.text_area("Reviewer expertise", placeholder="Example: solar energy, circuits, engineering education")
    if st.button("Save demo profile"):
        if not name or not email:
            st.error("Please enter name and email.")
        else:
            user_id = upsert_user(DB_PATH, name, email, role, country=country, expertise=expertise or None)
            st.session_state["user"] = {"user_id": user_id, "name": name, "email": email, "role": role, "country": country}
            st.success(f"Profile saved for {name}.")

    st.divider()
    stats = manuscript_stats(DB_PATH)
    st.metric("Published", stats.get("published", 0))
    st.metric("Under review", stats.get("under_review", 0))
    st.metric("Reviewers", stats.get("reviewers", 0))

st.title(APP_NAME)
st.caption(APP_TAGLINE)
st.info(
    "MVP note: this demo uses local similarity search and demo login. For real student use, add production authentication, privacy/consent policies, and a licensed plagiarism source."
)

home_tab, submit_tab, review_tab, admin_tab, about_tab = st.tabs(
    ["Published Library", "Student Submit / Write", "Reviewer Portal", "Editor Admin", "About"]
)

with home_tab:
    st.header("Published electronic papers")
    query = st.text_input("Search title, abstract, author, or keywords", key="library_search")
    papers = list_published(DB_PATH, query=query)
    if not papers:
        st.write("No published papers yet. Use the admin tab to publish an accepted manuscript.")
    for paper in papers:
        with st.expander(f"{paper['title']} — {paper.get('author_name', 'Unknown author')}", expanded=False):
            show_status_badge(paper["status"])
            st.write(f"**Author:** {paper.get('author_name', '')} ({paper.get('country', '')})")
            st.write(f"**Field:** {paper.get('field', '')}")
            st.write(f"**Keywords:** {paper.get('keywords', '')}")
            st.write(f"**Publication slug:** `{paper.get('doi_slug', '')}`")
            st.write("**Abstract**")
            st.write(paper.get("abstract", ""))
            st.write("**Manuscript text**")
            st.write(paper.get("manuscript_text", "")[:6000])

with submit_tab:
    st.header("Student manuscript submission")
    st.write("Upload a manuscript or write directly in the online editor. Run a local AI similarity screen before submission.")
    col_a, col_b = st.columns(2)
    with col_a:
        student_name = st.text_input("Student author name", value=st.session_state.get("user", {}).get("name", ""), key="student_name")
        student_email = st.text_input("Student email", value=st.session_state.get("user", {}).get("email", ""), key="student_email")
        student_country = st.text_input("Country", value=st.session_state.get("user", {}).get("country", ""), key="student_country")
        title = st.text_input("Manuscript title")
        field = st.selectbox(
            "Research field",
            [
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
                "Other",
            ],
        )
        keywords = st.text_input("Keywords, separated by commas")
    with col_b:
        abstract = st.text_area("Abstract", height=180)
        uploaded_file = st.file_uploader("Upload manuscript file", type=["txt", "md", "pdf", "docx"])

    uploaded_text = ""
    file_name = "online-editor"
    if uploaded_file is not None:
        try:
            uploaded_text = read_uploaded_file(uploaded_file)
            file_name = uploaded_file.name
            st.success(f"Extracted {word_count(uploaded_text)} words from {uploaded_file.name}.")
        except Exception as exc:
            st.error(f"Could not read uploaded file: {exc}")

    manuscript_text = st.text_area(
        "Online manuscript editor",
        value=uploaded_text,
        height=420,
        placeholder="Paste or write the full manuscript here. Suggested sections: Abstract, Introduction, Methods, Results, Discussion, References.",
    )
    st.caption(f"Current manuscript length: {word_count(manuscript_text)} words")

    hints = manuscript_quality_hints(manuscript_text)
    if hints:
        with st.expander("AI writing and structure hints"):
            for hint in hints:
                st.write(f"- {hint}")

    scan_result = None
    if st.button("Run local AI plagiarism / similarity scan"):
        corpus = get_local_similarity_corpus(DB_PATH)
        scan_result = plagiarism_scan(manuscript_text, corpus, top_n=5)
        st.session_state["last_scan"] = scan_result
    if "last_scan" in st.session_state:
        scan_result = st.session_state["last_scan"]
        risk_box(scan_result["score"], scan_result["report"])
        st.json(scan_result["matches"], expanded=False)

    col1, col2 = st.columns(2)
    with col1:
        if st.button("Save as online draft"):
            required = [student_name, student_email, title, field, manuscript_text]
            if not all(required):
                st.error("Please complete name, email, title, field, and manuscript text.")
            else:
                manuscript_id = save_draft(
                    DB_PATH,
                    student_name,
                    student_email,
                    student_country,
                    title,
                    abstract,
                    field,
                    keywords,
                    manuscript_text,
                    file_name=file_name,
                )
                st.success(f"Draft saved. Manuscript ID: {manuscript_id}")
    with col2:
        if st.button("Submit for review"):
            required = [student_name, student_email, title, field, manuscript_text]
            if not all(required):
                st.error("Please complete name, email, title, field, and manuscript text.")
            else:
                result = submit_manuscript(
                    DB_PATH,
                    student_name,
                    student_email,
                    student_country,
                    title,
                    abstract,
                    field,
                    keywords,
                    manuscript_text,
                    file_name=file_name,
                    plagiarism_override=st.session_state.get("last_scan"),
                )
                st.success(f"Submitted manuscript ID {result['manuscript_id']} and assigned reviewers.")
                risk_box(result["plagiarism"]["score"], result["plagiarism"]["report"])
                if result["assignments"]:
                    st.write("**AI-matched reviewer assignments**")
                    st.dataframe(pd.DataFrame(result["assignments"])[["name", "email", "country", "match_score", "assignment_link"]])

with review_tab:
    st.header("Reviewer portal")
    reviewer_email = st.text_input("Reviewer email", value=st.session_state.get("user", {}).get("email", ""), key="reviewer_email")
    reviewer_name = st.text_input("Reviewer name", value=st.session_state.get("user", {}).get("name", ""), key="reviewer_name")
    if reviewer_email:
        assignments = get_assignments_for_reviewer(DB_PATH, reviewer_email)
        if not assignments:
            st.warning("No assignments found for this email. Admins can add reviewers or submit a manuscript to trigger matching.")
        for assignment in assignments:
            with st.expander(f"Review: {assignment['title']} ({assignment['manuscript_status']})", expanded=False):
                st.write(f"**Author:** {assignment['author_name']} ({assignment['country']})")
                st.write(f"**Field:** {assignment['field']}")
                st.write(f"**Keywords:** {assignment['keywords']}")
                st.write(f"**Match score:** {assignment['match_score']:.1%}")
                st.write("**Abstract**")
                st.write(assignment["abstract"])
                st.write("**Manuscript text**")
                st.text_area("Read manuscript", assignment["manuscript_text"], height=260, key=f"read_{assignment['assignment_id']}")
                recommendation = st.selectbox(
                    "Recommendation",
                    ["accept", "minor_revision", "major_revision", "reject"],
                    key=f"rec_{assignment['assignment_id']}",
                )
                comments_author = st.text_area("Comments to author", key=f"author_comments_{assignment['assignment_id']}")
                comments_editor = st.text_area("Confidential comments to editor", key=f"editor_comments_{assignment['assignment_id']}")
                confidence = st.slider("Reviewer confidence", 1, 5, 3, key=f"confidence_{assignment['assignment_id']}")
                if st.button("Submit review", key=f"submit_review_{assignment['assignment_id']}"):
                    if not reviewer_name or not reviewer_email or not comments_author:
                        st.error("Reviewer name, email, and author comments are required.")
                    else:
                        review_id = add_review(
                            DB_PATH,
                            int(assignment["manuscript_id"]),
                            reviewer_name,
                            reviewer_email,
                            recommendation,
                            comments_author,
                            comments_editor,
                            confidence,
                        )
                        st.success(f"Review submitted. Review ID: {review_id}")

with admin_tab:
    st.header("Editor/admin dashboard")
    st.write("For the MVP, admin access is not secured. Add real authorization before public use.")
    if st.button("Initialize/seed demo reviewers and sample corpus"):
        seeded = setup_platform(DB_PATH, reset=False)
        st.success(f"Seed complete: {seeded}")

    with st.expander("Add a reviewer"):
        r_name = st.text_input("Reviewer full name", key="admin_reviewer_name")
        r_email = st.text_input("Reviewer email", key="admin_reviewer_email")
        r_country = st.text_input("Reviewer country", key="admin_reviewer_country")
        r_expertise = st.text_area("Expertise profile", key="admin_reviewer_expertise")
        if st.button("Add/update reviewer"):
            if r_name and r_email and r_expertise:
                upsert_user(DB_PATH, r_name, r_email, "reviewer", country=r_country, expertise=r_expertise)
                st.success("Reviewer saved.")
            else:
                st.error("Name, email, and expertise are required.")

    manuscripts = list_manuscripts(DB_PATH)
    if manuscripts:
        df = pd.DataFrame(manuscripts)
        st.dataframe(df[["manuscript_id", "title", "author_name", "country", "field", "status", "plagiarism_score", "matched_reviewers"]])
        selected_id = st.number_input("Manuscript ID to manage", min_value=1, step=1)
        manuscript = fetch_one(DB_PATH, "SELECT * FROM manuscripts WHERE manuscript_id = ?", (int(selected_id),))
        if manuscript:
            st.subheader(manuscript["title"])
            show_status_badge(manuscript["status"])
            st.write("**Plagiarism report**")
            st.text(manuscript["plagiarism_report"])
            st.write("**Matched reviewers**")
            st.write(manuscript["matched_reviewers"] or "No matches stored.")
            reviews = list_reviews(DB_PATH, int(selected_id))
            if reviews:
                st.write("**Reviews**")
                st.dataframe(pd.DataFrame(reviews)[["reviewer_name", "recommendation", "confidence", "comments_to_author", "created_at"]])
            new_status = st.selectbox(
                "Set status",
                ["draft", "submitted", "under_review", "minor_revision", "major_revision", "accepted", "rejected", "published"],
                index=["draft", "submitted", "under_review", "minor_revision", "major_revision", "accepted", "rejected", "published"].index(manuscript["status"]),
            )
            col_s, col_p = st.columns(2)
            with col_s:
                if st.button("Update status"):
                    update_status(DB_PATH, int(selected_id), new_status)
                    st.success("Status updated.")
            with col_p:
                if st.button("Publish manuscript electronically"):
                    slug = publish_manuscript(DB_PATH, int(selected_id))
                    st.success(f"Published with slug: {slug}")
    else:
        st.write("No manuscripts yet.")

    with st.expander("Raw data export"):
        if manuscripts:
            st.download_button(
                "Download manuscript CSV",
                pd.DataFrame(manuscripts).to_csv(index=False).encode("utf-8"),
                file_name="manuscripts_export.csv",
                mime="text/csv",
            )

with about_tab:
    st.header("About this MVP")
    st.markdown(
        """
        **Mission.** Encourage African high school students to practice responsible research, peer review, revision, and electronic publication.

        **Founder/build lead.** Kavya can use this as a GitHub-open-source MVP and build toward a formal journal platform.

        **Electronic first.** This app publishes papers electronically. Printed hard copies can be considered later with a publishing/printing partner.

        **Ethical safeguards.** Because students may be minors, production use should include guardian consent, data privacy, content moderation, safe communication rules, and reviewer conflict-of-interest policies.

        **AI transparency.** The similarity scanner and reviewer matcher are assistive tools. Editors and teachers should make final decisions.
        """
    )
