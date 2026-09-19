from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run_top_header_layout_regression_test() -> dict[str, object]:
    ui_text = (ROOT / "journal_platform" / "ui.py").read_text(encoding="utf-8")

    required_markers = [
        "--streamlit-header-height: 3.75rem",
        "--journal-header-gap: 0.75rem",
        '[data-testid="stAppViewBlockContainer"]',
        "section.main > div.block-container",
        "env(safe-area-inset-top, 0px)",
        "padding-top: calc(",
        "z-index: 999990",
        "--streamlit-header-height: 3.5rem",
    ]
    for marker in required_markers:
        assert marker in ui_text, f"Missing top-layout safety marker: {marker}"

    assert "padding-top: 1.75rem" not in ui_text, "Legacy overlap-prone top padding is still active"
    assert ui_text.count('[data-testid="stAppViewBlockContainer"]') >= 2

    return {
        "desktop_header_clearance": "3.75rem + 0.75rem",
        "mobile_header_clearance": "3.5rem + 0.65rem",
        "safe_area_inset": True,
        "current_and_legacy_selectors": True,
    }


if __name__ == "__main__":
    summary = run_top_header_layout_regression_test()
    print("TOP HEADER LAYOUT REGRESSION TEST PASSED")
    for key, value in summary.items():
        print(f"{key}: {value}")
