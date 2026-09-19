from __future__ import annotations

import importlib
import sys
import types
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


class CaptureStreamlit(types.ModuleType):
    """Minimal Streamlit stand-in that captures rendered Markdown payloads."""

    def __init__(self) -> None:
        super().__init__("streamlit")
        self.markdown_calls: list[tuple[str, dict[str, Any]]] = []

    def markdown(self, body: str, **kwargs: Any) -> None:
        self.markdown_calls.append((body, kwargs))


def _last_html(fake: CaptureStreamlit) -> str:
    assert fake.markdown_calls, "Expected a Streamlit Markdown call"
    body, kwargs = fake.markdown_calls[-1]
    assert kwargs.get("unsafe_allow_html") is True
    return body


def run_html_grid_regression_test() -> dict[str, object]:
    fake = CaptureStreamlit()
    sys.modules["streamlit"] = fake
    sys.modules.pop("journal_platform.ui", None)
    ui = importlib.import_module("journal_platform.ui")

    ui.render_workflow()
    workflow_html = _last_html(fake)
    assert workflow_html.startswith('<div class="workflow-grid">')
    assert workflow_html.endswith("</div>")
    assert workflow_html.count('class="workflow-card"') == 5
    assert workflow_html.count('class="workflow-number"') == 5
    assert "\n\n" not in workflow_html
    assert "\n    <div" not in workflow_html

    ui.render_feature_grid()
    feature_html = _last_html(fake)
    assert feature_html.startswith('<div class="feature-grid">')
    assert feature_html.endswith("</div>")
    assert feature_html.count('class="feature-card"') == 6
    assert feature_html.count('class="feature-label"') == 6
    assert "\n\n" not in feature_html
    assert "\n    <div" not in feature_html

    return {
        "workflow_cards": workflow_html.count('class="workflow-card"'),
        "feature_cards": feature_html.count('class="feature-card"'),
        "compact_html_verified": True,
    }


if __name__ == "__main__":
    summary = run_html_grid_regression_test()
    print("HTML GRID REGRESSION TEST PASSED")
    for key, value in summary.items():
        print(f"{key}: {value}")
