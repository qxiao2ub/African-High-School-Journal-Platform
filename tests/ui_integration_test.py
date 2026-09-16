from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run_ui_integration_test() -> dict[str, object]:
    required_assets = [
        ROOT / "assets" / "journal-seal.png",
        ROOT / "assets" / "hero-classroom.jpg",
        ROOT / "assets" / "story-robotics.jpg",
        ROOT / "assets" / "story-debate.jpg",
        ROOT / "assets" / "story-culture.jpg",
        ROOT / "assets" / "story-football.jpg",
        ROOT / "assets" / "favicon.png",
    ]
    missing_assets = [str(path.relative_to(ROOT)) for path in required_assets if not path.exists()]
    assert not missing_assets, f"Missing UI assets: {missing_assets}"

    app_text = (ROOT / "app.py").read_text(encoding="utf-8")
    ui_text = (ROOT / "journal_platform" / "ui.py").read_text(encoding="utf-8")
    config_text = (ROOT / "journal_platform" / "config.py").read_text(encoding="utf-8")
    readme_text = (ROOT / "README.md").read_text(encoding="utf-8")

    required_app_markers = [
        "Published Library",
        "Submit / Write",
        "Reviewer Desk",
        "Editorial Office",
        "render_hero",
        "render_feature_grid",
        "render_footer",
    ]
    for marker in required_app_markers:
        assert marker in app_text, f"Missing app integration marker: {marker}"

    required_ui_markers = [
        "journal-masthead",
        "journal-hero",
        "workflow-grid",
        "article-card",
        "journal-footer",
        "@media (max-width: 640px)",
    ]
    for marker in required_ui_markers:
        assert marker in ui_text, f"Missing UI style marker: {marker}"

    for name in ["Kavya Kaushal Shah", "Dr. Qingyang Xiao"]:
        assert name in config_text, f"Missing project credit in config: {name}"
        assert name in readme_text, f"Missing project credit in README: {name}"

    reference_dir = ROOT / "ui_design_reference" / "react_vite_prototype"
    assert (reference_dir / "src" / "App.tsx").exists(), "Original React UI reference was not preserved"
    assert (ROOT / "UI_MIGRATION_NOTES.md").exists(), "UI migration documentation is missing"

    return {
        "asset_count": len(required_assets),
        "app_markers": len(required_app_markers),
        "ui_markers": len(required_ui_markers),
        "react_reference_preserved": True,
        "credits_verified": True,
    }


if __name__ == "__main__":
    summary = run_ui_integration_test()
    print("UI INTEGRATION TEST PASSED")
    for key, value in summary.items():
        print(f"{key}: {value}")
