from __future__ import annotations

import tempfile
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from journal_platform.db import fetch_all, initialize_with_seed_data
from journal_platform.services import add_review, list_published, publish_manuscript, submit_manuscript


def run_smoke_test() -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        db_path = Path(tmp) / "smoke.db"
        seeded = initialize_with_seed_data(db_path, reset=True)
        assert seeded["reviewers"] >= 3, "Expected seeded reviewers"
        assert seeded["sources"] >= 3, "Expected sample corpus"

        original_text = """
        Abstract: This student research paper studies solar energy for school laboratories.
        Introduction: Renewable energy can help classrooms understand electricity and sustainability.
        Methods: We measured voltage from small solar panels under shade and sunlight.
        Results: The panel produced higher voltage in direct sunlight than under shade.
        Discussion: The experiment can be improved with repeated trials and temperature records.
        References: Teacher-provided laboratory manual.
        """
        result = submit_manuscript(
            db_path,
            student_name="Test Student",
            student_email="student@example.org",
            country="Kenya",
            title="Solar Panel Voltage in School Laboratories",
            abstract="A student project measuring small solar panel voltage.",
            field="Energy",
            keywords="solar energy, voltage, school laboratory",
            manuscript_text=original_text,
            file_name="solar.txt",
        )
        assert result["manuscript_id"] > 0
        assert len(result["assignments"]) > 0, "Expected reviewer assignments"

        copied_result = submit_manuscript(
            db_path,
            student_name="Second Student",
            student_email="second@example.org",
            country="Ghana",
            title="Copied Solar Panel Voltage Study",
            abstract="A very similar project.",
            field="Energy",
            keywords="solar energy, voltage",
            manuscript_text=original_text,
            file_name="copy.txt",
        )
        assert copied_result["plagiarism"]["score"] > 0.40, "Expected high similarity to first submitted manuscript"

        reviewer_email = result["assignments"][0]["email"]
        review_id = add_review(
            db_path,
            manuscript_id=result["manuscript_id"],
            reviewer_name=result["assignments"][0]["name"],
            reviewer_email=reviewer_email,
            recommendation="accept",
            comments_to_author="Good student-level study. Please polish the references before publication.",
            comments_to_editor="Ready for MVP acceptance.",
            confidence=4,
        )
        assert review_id > 0
        slug = publish_manuscript(db_path, result["manuscript_id"])
        assert slug.startswith("ahsj-2026")
        published = list_published(db_path)
        assert len(published) == 1
        assignments = fetch_all(db_path, "SELECT * FROM review_assignments")
        assert assignments, "Expected assignments in database"
        return {
            "seeded": seeded,
            "first_manuscript_id": result["manuscript_id"],
            "copy_similarity_score": round(copied_result["plagiarism"]["score"], 3),
            "review_id": review_id,
            "published_slug": slug,
            "assignment_count": len(assignments),
        }


if __name__ == "__main__":
    summary = run_smoke_test()
    print("SMOKE TEST PASSED")
    for key, value in summary.items():
        print(f"{key}: {value}")
