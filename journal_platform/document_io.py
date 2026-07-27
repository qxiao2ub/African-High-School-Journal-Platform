from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import BinaryIO


def _read_pdf_bytes(data: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(BytesIO(data))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages).strip()


def _read_docx_bytes(data: bytes) -> str:
    from docx import Document

    doc = Document(BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs).strip()


def extract_text_from_bytes(data: bytes, filename: str) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix == ".pdf":
        return _read_pdf_bytes(data)
    if suffix == ".docx":
        return _read_docx_bytes(data)
    if suffix in {".txt", ".md", ".markdown", ".csv"}:
        return data.decode("utf-8", errors="replace")
    return data.decode("utf-8", errors="replace")


def read_uploaded_file(uploaded_file: BinaryIO) -> str:
    name = getattr(uploaded_file, "name", "uploaded.txt")
    data = uploaded_file.read()
    return extract_text_from_bytes(data, name)
