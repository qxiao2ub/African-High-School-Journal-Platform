from __future__ import annotations

import base64
import html
from pathlib import Path
from typing import Iterable

import streamlit as st


NAVY = "#12355B"
NAVY_DARK = "#0B2340"
GOLD = "#C6A15B"
CREAM = "#F8F4EA"
INK = "#17243A"
TEAL = "#1E7F7A"


def image_data_uri(path: Path) -> str:
    if not path.exists():
        return ""
    suffix = path.suffix.lower().lstrip(".") or "png"
    mime = "jpeg" if suffix in {"jpg", "jpeg"} else suffix
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/{mime};base64,{encoded}"


def inject_theme() -> None:
    st.markdown(
        """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Literata:opsz,wght@7..72,500;7..72,600;7..72,700;7..72,800&display=swap');

        :root {
            --journal-navy: #12355B;
            --journal-navy-dark: #0B2340;
            --journal-gold: #C6A15B;
            --journal-cream: #F8F4EA;
            --journal-paper: #FFFDF8;
            --journal-ink: #17243A;
            --journal-muted: #667085;
            --journal-teal: #1E7F7A;
            --journal-border: #D8D0C0;
            --journal-shadow: 0 18px 45px rgba(12, 34, 61, 0.10);
        }

        html, body, [class*="css"] {
            font-family: "Inter", Arial, sans-serif;
            color: var(--journal-ink);
        }

        .stApp {
            background:
                radial-gradient(circle at 12% 0%, rgba(198, 161, 91, 0.13), transparent 26rem),
                radial-gradient(circle at 92% 18%, rgba(30, 127, 122, 0.08), transparent 24rem),
                var(--journal-cream);
        }

        [data-testid="stHeader"] {
            background: rgba(248, 244, 234, 0.96);
            border-bottom: 1px solid rgba(18, 53, 91, 0.08);
            backdrop-filter: blur(12px);
        }

        [data-testid="stToolbar"] {
            right: 1rem;
        }

        .block-container {
            max-width: 1280px;
            padding-top: 1.75rem;
            padding-bottom: 5rem;
        }

        [data-testid="stSidebar"] {
            background: linear-gradient(180deg, #0B2340 0%, #12355B 58%, #173E66 100%);
            border-right: 1px solid rgba(255, 255, 255, 0.10);
        }

        [data-testid="stSidebar"] * {
            color: #F9F4E8;
        }

        [data-testid="stSidebar"] input,
        [data-testid="stSidebar"] textarea,
        [data-testid="stSidebar"] [data-baseweb="select"] > div {
            background: rgba(255, 255, 255, 0.09) !important;
            color: #FFFFFF !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
        }

        [data-testid="stSidebar"] [data-baseweb="select"] span,
        [data-testid="stSidebar"] input::placeholder,
        [data-testid="stSidebar"] textarea::placeholder {
            color: rgba(255, 255, 255, 0.70) !important;
        }

        [data-testid="stSidebar"] hr {
            border-color: rgba(255, 255, 255, 0.15);
        }

        h1, h2, h3, h4, h5, h6,
        .journal-serif {
            font-family: "Literata", Georgia, serif;
            letter-spacing: -0.025em;
            color: var(--journal-ink);
        }

        h1 { font-weight: 800; }
        h2, h3 { font-weight: 700; }

        p, li, label, .stMarkdown {
            line-height: 1.65;
        }

        a {
            color: var(--journal-navy);
        }

        .journal-topbar {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            align-items: center;
            border-top: 3px solid var(--journal-navy);
            border-bottom: 1px solid var(--journal-border);
            padding: 0.55rem 0.8rem;
            color: var(--journal-muted);
            font-size: 0.72rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        .journal-masthead {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.15rem;
            padding: 1.3rem 1rem 1.15rem;
            text-align: left;
            border-bottom: 1px solid var(--journal-border);
            background: rgba(255, 253, 248, 0.58);
        }

        .journal-masthead img {
            width: 92px;
            height: 92px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--journal-gold);
            box-shadow: 0 8px 22px rgba(18, 53, 91, 0.16);
        }

        .journal-kicker {
            color: var(--journal-gold);
            font-family: "Literata", Georgia, serif;
            font-style: italic;
            font-size: 1.02rem;
            letter-spacing: 0.20em;
            margin-bottom: -0.1rem;
        }

        .journal-title {
            font-family: "Literata", Georgia, serif;
            color: var(--journal-navy-dark);
            font-weight: 800;
            font-size: clamp(1.65rem, 4vw, 2.55rem);
            line-height: 1.02;
            text-transform: uppercase;
            letter-spacing: -0.035em;
        }

        .journal-subtitle {
            color: var(--journal-muted);
            text-transform: uppercase;
            letter-spacing: 0.20em;
            font-size: 0.66rem;
            margin-top: 0.4rem;
        }

        .journal-credit-line {
            color: var(--journal-navy);
            font-size: 0.76rem;
            font-weight: 600;
            margin-top: 0.5rem;
        }

        div[role="radiogroup"] {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.15rem;
            background: var(--journal-paper);
            border-bottom: 1px solid var(--journal-border);
            padding: 0.15rem 0.35rem 0.45rem;
            margin-bottom: 1.1rem;
        }

        div[role="radiogroup"] > label {
            border-radius: 0;
            padding: 0.45rem 0.72rem;
            border-bottom: 2px solid transparent;
            transition: all 0.15s ease;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.035em;
            text-transform: uppercase;
        }

        div[role="radiogroup"] > label:hover {
            color: var(--journal-navy);
            border-bottom-color: var(--journal-gold);
            background: rgba(198, 161, 91, 0.08);
        }

        .journal-hero {
            min-height: 430px;
            border-radius: 0.7rem;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: flex-end;
            background-size: cover;
            background-position: center 42%;
            box-shadow: var(--journal-shadow);
            border: 1px solid rgba(18, 53, 91, 0.14);
            margin: 0.5rem 0 1rem;
        }

        .journal-hero::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
                linear-gradient(90deg, rgba(7, 28, 51, 0.94) 0%, rgba(12, 43, 73, 0.82) 42%, rgba(12, 43, 73, 0.24) 72%, rgba(12, 43, 73, 0.08) 100%),
                linear-gradient(0deg, rgba(7, 28, 51, 0.82) 0%, transparent 55%);
        }

        .journal-hero-content {
            position: relative;
            z-index: 2;
            max-width: 720px;
            padding: clamp(1.6rem, 5vw, 3.4rem);
            color: white;
        }

        .journal-hero-eyebrow {
            color: #F0D58E;
            font-size: 0.77rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.17em;
            margin-bottom: 0.65rem;
        }

        .journal-hero h1 {
            color: white;
            font-size: clamp(2rem, 6vw, 4.15rem);
            line-height: 1.02;
            margin: 0 0 0.8rem;
            text-shadow: 0 5px 18px rgba(0, 0, 0, 0.28);
        }

        .journal-hero p {
            color: rgba(255, 255, 255, 0.90);
            font-size: clamp(0.95rem, 1.7vw, 1.15rem);
            max-width: 640px;
            margin: 0;
        }

        .journal-hero-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin-top: 1.1rem;
        }

        .journal-hero-tags span {
            border: 1px solid rgba(255, 255, 255, 0.28);
            background: rgba(255, 255, 255, 0.12);
            color: white;
            border-radius: 99px;
            padding: 0.28rem 0.65rem;
            font-size: 0.70rem;
            letter-spacing: 0.035em;
            backdrop-filter: blur(8px);
        }

        .journal-stats {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.75rem;
            margin: 1rem 0 2rem;
        }

        .journal-stat {
            background: var(--journal-paper);
            border: 1px solid var(--journal-border);
            border-top: 3px solid var(--journal-gold);
            padding: 1rem 1.1rem;
            box-shadow: 0 9px 25px rgba(18, 53, 91, 0.06);
        }

        .journal-stat strong {
            display: block;
            color: var(--journal-navy);
            font-family: "Literata", Georgia, serif;
            font-size: 1.65rem;
            line-height: 1;
        }

        .journal-stat span {
            color: var(--journal-muted);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .section-heading {
            display: flex;
            justify-content: space-between;
            align-items: end;
            gap: 1rem;
            border-bottom: 2px solid var(--journal-navy);
            padding-bottom: 0.55rem;
            margin: 2.2rem 0 1.2rem;
        }

        .section-heading .eyebrow {
            color: var(--journal-gold);
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            margin-bottom: 0.2rem;
        }

        .section-heading h2 {
            margin: 0;
            font-size: clamp(1.55rem, 3vw, 2.25rem);
            color: var(--journal-navy-dark);
        }

        .section-heading p {
            color: var(--journal-muted);
            font-size: 0.83rem;
            margin: 0;
            max-width: 480px;
            text-align: right;
        }

        .workflow-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 0.75rem;
        }

        .workflow-card {
            position: relative;
            background: var(--journal-paper);
            border: 1px solid var(--journal-border);
            padding: 1.15rem;
            min-height: 195px;
            box-shadow: 0 9px 26px rgba(18, 53, 91, 0.05);
        }

        .workflow-card::after {
            content: "";
            position: absolute;
            top: 2.05rem;
            right: -0.75rem;
            width: 0.75rem;
            height: 2px;
            background: var(--journal-gold);
        }

        .workflow-card:last-child::after { display: none; }

        .workflow-number {
            width: 2rem;
            height: 2rem;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: var(--journal-navy);
            color: white;
            border: 3px solid #EBD59E;
            font-family: "Literata", Georgia, serif;
            font-weight: 800;
            margin-bottom: 0.8rem;
        }

        .workflow-card h3 {
            font-size: 1rem;
            margin: 0 0 0.45rem;
            color: var(--journal-navy-dark);
        }

        .workflow-card p {
            color: var(--journal-muted);
            font-size: 0.80rem;
            margin: 0;
            line-height: 1.55;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.9rem;
        }

        .feature-card {
            background: var(--journal-paper);
            border: 1px solid var(--journal-border);
            padding: 1.25rem;
            box-shadow: 0 9px 26px rgba(18, 53, 91, 0.05);
        }

        .feature-card .feature-label {
            color: var(--journal-gold);
            font-size: 0.70rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.12em;
        }

        .feature-card h3 {
            color: var(--journal-navy-dark);
            margin: 0.35rem 0 0.55rem;
            font-size: 1.05rem;
        }

        .feature-card p {
            color: var(--journal-muted);
            font-size: 0.82rem;
            margin: 0;
        }

        .page-intro {
            background: linear-gradient(135deg, var(--journal-navy-dark), var(--journal-navy));
            color: white;
            padding: 1.45rem 1.55rem;
            border-left: 5px solid var(--journal-gold);
            box-shadow: var(--journal-shadow);
            margin: 0.75rem 0 1.35rem;
        }

        .page-intro .eyebrow {
            color: #F0D58E;
            font-size: 0.71rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            font-weight: 700;
        }

        .page-intro h1 {
            color: white;
            margin: 0.25rem 0 0.45rem;
            font-size: clamp(1.65rem, 4vw, 2.65rem);
        }

        .page-intro p {
            color: rgba(255, 255, 255, 0.83);
            margin: 0;
            max-width: 920px;
        }

        .article-card {
            background: var(--journal-paper);
            border: 1px solid var(--journal-border);
            border-top: 4px solid var(--journal-navy);
            padding: 1.15rem 1.15rem 0.95rem;
            margin-bottom: 0.75rem;
            box-shadow: 0 9px 26px rgba(18, 53, 91, 0.05);
            min-height: 220px;
        }

        .article-card .meta {
            color: var(--journal-gold);
            font-size: 0.68rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .article-card h3 {
            color: var(--journal-navy-dark);
            font-size: 1.22rem;
            margin: 0.42rem 0 0.45rem;
        }

        .article-card p {
            color: var(--journal-muted);
            font-size: 0.84rem;
            margin: 0 0 0.6rem;
        }

        .article-card .byline {
            color: var(--journal-ink);
            font-size: 0.76rem;
            font-weight: 600;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            border-radius: 99px;
            padding: 0.24rem 0.58rem;
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            border: 1px solid;
        }

        .status-draft { color: #475467; background: #F2F4F7; border-color: #D0D5DD; }
        .status-submitted { color: #175CD3; background: #EFF8FF; border-color: #B2DDFF; }
        .status-under_review { color: #6941C6; background: #F4F3FF; border-color: #D9D6FE; }
        .status-minor_revision { color: #B54708; background: #FFFAEB; border-color: #FEDF89; }
        .status-major_revision { color: #B42318; background: #FFF4ED; border-color: #FFD6AE; }
        .status-accepted { color: #027A48; background: #ECFDF3; border-color: #ABEFC6; }
        .status-rejected { color: #B42318; background: #FEF3F2; border-color: #FECDCA; }
        .status-published { color: #05603A; background: #E8FFF3; border-color: #8DECB9; }

        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin: 0.65rem 0;
        }

        .tech-stack span {
            border: 1px solid rgba(18, 53, 91, 0.18);
            background: rgba(18, 53, 91, 0.05);
            color: var(--journal-navy);
            border-radius: 99px;
            padding: 0.32rem 0.68rem;
            font-size: 0.72rem;
            font-weight: 700;
        }

        .journal-note {
            background: #FFF9E9;
            border-left: 4px solid var(--journal-gold);
            color: #5F4A1D;
            padding: 0.85rem 1rem;
            margin: 0.8rem 0;
            font-size: 0.84rem;
        }

        .journal-sidebar-brand {
            text-align: center;
            margin: 0.3rem 0 0.85rem;
        }

        .journal-sidebar-brand img {
            width: 105px;
            height: 105px;
            border-radius: 50%;
            border: 3px solid #D8B96D;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
        }

        .journal-sidebar-brand h3 {
            color: white;
            margin: 0.65rem 0 0.1rem;
            font-size: 1.05rem;
        }

        .journal-sidebar-brand p {
            color: rgba(255, 255, 255, 0.72);
            font-size: 0.72rem;
            margin: 0;
        }

        div[data-testid="stMetric"] {
            background: var(--journal-paper);
            border: 1px solid var(--journal-border);
            border-top: 3px solid var(--journal-gold);
            padding: 0.8rem 1rem;
            box-shadow: 0 8px 24px rgba(18, 53, 91, 0.05);
        }

        div[data-testid="stMetric"] label {
            color: var(--journal-muted);
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        .stButton > button,
        .stDownloadButton > button,
        [data-testid="stFormSubmitButton"] > button {
            border-radius: 0.2rem;
            min-height: 2.65rem;
            font-weight: 700;
            letter-spacing: 0.015em;
            border: 1px solid var(--journal-navy);
            transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .stButton > button:hover,
        .stDownloadButton > button:hover,
        [data-testid="stFormSubmitButton"] > button:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 18px rgba(18, 53, 91, 0.12);
        }

        .stTextInput input,
        .stTextArea textarea,
        .stFileUploader,
        [data-baseweb="select"] > div {
            border-radius: 0.2rem !important;
        }

        [data-testid="stExpander"] {
            background: var(--journal-paper);
            border: 1px solid var(--journal-border);
            border-radius: 0.25rem;
            box-shadow: 0 6px 18px rgba(18, 53, 91, 0.04);
        }

        [data-testid="stDataFrame"] {
            border: 1px solid var(--journal-border);
            background: var(--journal-paper);
        }

        [data-testid="stImage"] img {
            border-radius: 0.35rem;
            border: 1px solid rgba(18, 53, 91, 0.12);
            box-shadow: 0 10px 28px rgba(18, 53, 91, 0.10);
        }

        .journal-footer {
            margin-top: 3.4rem;
            background: var(--journal-navy-dark);
            color: rgba(255, 255, 255, 0.78);
            border-top: 5px solid var(--journal-gold);
            padding: 1.35rem 1.5rem;
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 1rem;
            align-items: center;
        }

        .journal-footer strong {
            color: white;
            font-family: "Literata", Georgia, serif;
        }

        .journal-footer a {
            color: #F0D58E;
            text-decoration: none;
        }

        .journal-footer .right {
            text-align: right;
            font-size: 0.75rem;
        }

        @media (max-width: 900px) {
            .journal-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .workflow-grid { grid-template-columns: 1fr 1fr; }
            .workflow-card::after { display: none; }
            .feature-grid { grid-template-columns: 1fr; }
            .section-heading { align-items: start; flex-direction: column; }
            .section-heading p { text-align: left; }
        }

        @media (max-width: 640px) {
            .block-container { padding-left: 0.75rem; padding-right: 0.75rem; }
            .journal-topbar { display: none; }
            .journal-masthead { align-items: center; gap: 0.75rem; padding: 0.85rem 0.4rem; }
            .journal-masthead img { width: 64px; height: 64px; }
            .journal-kicker { font-size: 0.70rem; }
            .journal-title { font-size: 1.18rem; }
            .journal-subtitle { font-size: 0.52rem; letter-spacing: 0.12em; }
            .journal-credit-line { font-size: 0.62rem; }
            .journal-hero { min-height: 390px; background-position: 60% center; }
            .journal-hero::after { background: linear-gradient(0deg, rgba(7, 28, 51, 0.96) 0%, rgba(7, 28, 51, 0.68) 72%, rgba(7, 28, 51, 0.15) 100%); }
            .journal-hero-content { padding: 1.35rem; }
            .journal-stats { grid-template-columns: 1fr 1fr; }
            .workflow-grid { grid-template-columns: 1fr; }
            .journal-footer { grid-template-columns: 1fr; }
            .journal-footer .right { text-align: left; }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_masthead(
    logo_path: Path,
    date_text: str,
    publication_name: str,
    founder: str,
    advisor: str,
) -> None:
    logo_uri = image_data_uri(logo_path)
    st.markdown(
        f"""
        <div class="journal-topbar">
          <span>{html.escape(date_text)}</span>
          <span>Open access &nbsp; | &nbsp; Student research &nbsp; | &nbsp; Responsible peer review</span>
        </div>
        <div class="journal-masthead">
          <img src="{logo_uri}" alt="African High School Journal seal" />
          <div>
            <div class="journal-kicker">The African</div>
            <div class="journal-title">{html.escape(publication_name)}</div>
            <div class="journal-subtitle">Student research across the continent</div>
            <div class="journal-credit-line">Founder / Author: {html.escape(founder)} &nbsp; | &nbsp; Advisor / Mentor: {html.escape(advisor)}</div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_sidebar_brand(logo_path: Path, publication_name: str) -> None:
    logo_uri = image_data_uri(logo_path)
    st.markdown(
        f"""
        <div class="journal-sidebar-brand">
          <img src="{logo_uri}" alt="Journal seal" />
          <h3>{html.escape(publication_name)}</h3>
          <p>Research. Review. Revise. Publish.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_hero(hero_path: Path) -> None:
    hero_uri = image_data_uri(hero_path)
    st.markdown(
        f"""
        <section class="journal-hero" style="background-image: url('{hero_uri}');">
          <div class="journal-hero-content">
            <div class="journal-hero-eyebrow">A professional publishing pathway for emerging scholars</div>
            <h1>Young African ideas deserve a global research stage.</h1>
            <p>Write or upload a manuscript, receive AI-assisted integrity feedback, connect with qualified teachers and professors, revise with purpose, and publish in an electronic student journal.</p>
            <div class="journal-hero-tags">
              <span>Online manuscript studio</span>
              <span>AI similarity screening</span>
              <span>Smart reviewer matching</span>
              <span>Structured peer review</span>
              <span>Open electronic library</span>
            </div>
          </div>
        </section>
        """,
        unsafe_allow_html=True,
    )


def render_stats(items: Iterable[tuple[str, object]]) -> None:
    cards = "".join(
        f'<div class="journal-stat"><strong>{html.escape(str(value))}</strong><span>{html.escape(label)}</span></div>'
        for label, value in items
    )
    st.markdown(f'<div class="journal-stats">{cards}</div>', unsafe_allow_html=True)


def render_section_heading(eyebrow: str, title: str, description: str = "") -> None:
    desc = f"<p>{html.escape(description)}</p>" if description else ""
    st.markdown(
        f"""
        <div class="section-heading">
          <div>
            <div class="eyebrow">{html.escape(eyebrow)}</div>
            <h2>{html.escape(title)}</h2>
          </div>
          {desc}
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_page_intro(eyebrow: str, title: str, description: str) -> None:
    st.markdown(
        f"""
        <div class="page-intro">
          <div class="eyebrow">{html.escape(eyebrow)}</div>
          <h1>{html.escape(title)}</h1>
          <p>{html.escape(description)}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_workflow() -> None:
    steps = [
        ("1", "Write or upload", "Draft online or upload a DOCX, PDF, Markdown, or text manuscript with structured metadata."),
        ("2", "AI integrity check", "Use local NLP similarity screening and writing-structure hints before final submission."),
        ("3", "Reviewer match", "Rank teachers and professors by field, expertise, keywords, abstract, and manuscript context."),
        ("4", "Expert peer review", "Collect comments and recommendations: accept, minor revision, major revision, or reject."),
        ("5", "Electronic publish", "Release accepted work to the searchable open-access journal library for global readers."),
    ]

    # Keep sibling HTML elements on one uninterrupted line. Markdown renderers end
    # a raw-HTML block at a blank line; the former indented triple-quoted strings
    # therefore rendered only the first card and displayed the remaining tags as
    # code. Compact markup prevents that parser boundary on Streamlit Cloud.
    cards = "".join(
        f'<div class="workflow-card">'
        f'<div class="workflow-number">{html.escape(number)}</div>'
        f'<h3>{html.escape(title)}</h3>'
        f'<p>{html.escape(body)}</p>'
        f'</div>'
        for number, title, body in steps
    )
    st.markdown(f'<div class="workflow-grid">{cards}</div>', unsafe_allow_html=True)


def render_feature_grid() -> None:
    features = [
        ("AI + NLP", "Similarity and integrity support", "TF-IDF and cosine similarity compare a submission with the local journal corpus and clearly label the result as an assistive screen, not a misconduct judgment."),
        ("AI + Matching", "Expert reviewer recommendations", "Manuscript title, abstract, keywords, field, and full text are compared with reviewer expertise to produce transparent ranked matches."),
        ("Research workflow", "End-to-end editorial management", "Drafting, submission, assignments, reviews, status decisions, version history, publication slugs, and exports are integrated in one Streamlit application."),
        ("Student experience", "Built-in online writing studio", "Students can write, save, upload, inspect AI structure hints, track status, and prepare revisions without leaving the platform."),
        ("Community impact", "African student voices first", "The platform is designed to expand access to research mentorship, publication literacy, and cross-border scholarly visibility."),
        ("Open engineering", "GitHub-ready and extensible", "A modular Python, SQLite, scikit-learn, and Streamlit architecture supports testing now and future migration to managed identity, storage, and databases."),
    ]

    # As with the workflow cards, compact HTML avoids blank-line termination of
    # the raw-HTML block inside Streamlit's Markdown renderer.
    cards = "".join(
        f'<div class="feature-card">'
        f'<div class="feature-label">{html.escape(label)}</div>'
        f'<h3>{html.escape(title)}</h3>'
        f'<p>{html.escape(body)}</p>'
        f'</div>'
        for label, title, body in features
    )
    st.markdown(f'<div class="feature-grid">{cards}</div>', unsafe_allow_html=True)


def status_badge_html(status: str) -> str:
    normalized = (status or "unknown").strip().lower()
    label = normalized.replace("_", " ").title()
    safe_class = normalized if normalized in {
        "draft",
        "submitted",
        "under_review",
        "minor_revision",
        "major_revision",
        "accepted",
        "rejected",
        "published",
    } else "draft"
    return f'<span class="status-badge status-{safe_class}">{html.escape(label)}</span>'


def render_article_card(paper: dict) -> None:
    title = html.escape(str(paper.get("title") or "Untitled manuscript"))
    field = html.escape(str(paper.get("field") or "General research"))
    author = html.escape(str(paper.get("author_name") or "Student author"))
    country = html.escape(str(paper.get("country") or ""))
    abstract_raw = str(paper.get("abstract") or "No abstract was provided.")
    if len(abstract_raw) > 520:
        abstract_raw = abstract_raw[:517].rstrip() + "..."
    abstract = html.escape(abstract_raw)
    byline = f"{author}"
    if country:
        byline += f" &middot; {country}"
    st.markdown(
        f"""
        <article class="article-card">
          <div class="meta">{field} &nbsp; | &nbsp; Electronic publication</div>
          <h3>{title}</h3>
          <p>{abstract}</p>
          <div class="byline">{byline}</div>
          <div style="margin-top:0.65rem;">{status_badge_html(str(paper.get('status') or 'published'))}</div>
        </article>
        """,
        unsafe_allow_html=True,
    )


def render_tech_stack(items: Iterable[str]) -> None:
    tags = "".join(f"<span>{html.escape(str(item))}</span>" for item in items)
    st.markdown(f'<div class="tech-stack">{tags}</div>', unsafe_allow_html=True)


def render_note(text: str) -> None:
    st.markdown(f'<div class="journal-note">{html.escape(text)}</div>', unsafe_allow_html=True)


def render_footer(founder: str, advisor: str, github_url: str, app_url: str) -> None:
    st.markdown(
        f"""
        <footer class="journal-footer">
          <div>
            <strong>The African High School Research Journal</strong><br />
            An electronic-first, student-driven research and peer-review platform.<br />
            Founder / Author: {html.escape(founder)} &nbsp; | &nbsp; Advisor / Mentor: {html.escape(advisor)}
          </div>
          <div class="right">
            <a href="{html.escape(github_url)}" target="_blank" rel="noopener noreferrer">GitHub source repository</a><br />
            <a href="{html.escape(app_url)}" target="_blank" rel="noopener noreferrer">Live Streamlit application</a><br />
            Open access &nbsp; | &nbsp; Responsible AI &nbsp; | &nbsp; Global impact
          </div>
        </footer>
        """,
        unsafe_allow_html=True,
    )
