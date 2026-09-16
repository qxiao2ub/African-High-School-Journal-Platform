from __future__ import annotations

import os
import runpy
import sys
import tempfile
import types
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


class DummyContext:
    def __enter__(self) -> "DummyContext":
        return self

    def __exit__(self, exc_type: Any, exc: Any, traceback: Any) -> bool:
        return False

    def __getattr__(self, name: str):
        def method(*args: Any, **kwargs: Any) -> Any:
            if name in {"button", "download_button", "form_submit_button", "checkbox"}:
                return False
            return None

        return method


class FakeSessionState(dict):
    pass


class FakeStreamlit(types.ModuleType):
    def __init__(self) -> None:
        super().__init__("streamlit")
        self.session_state = FakeSessionState()
        self.query_params: dict[str, str] = {}
        self.sidebar = DummyContext()

    def set_page_config(self, *args: Any, **kwargs: Any) -> None:
        return None

    def cache_resource(self, func=None, **kwargs: Any):
        if func is None:
            return lambda wrapped: wrapped
        return func

    def markdown(self, *args: Any, **kwargs: Any) -> None:
        return None

    def title(self, *args: Any, **kwargs: Any) -> None:
        return None

    def header(self, *args: Any, **kwargs: Any) -> None:
        return None

    def subheader(self, *args: Any, **kwargs: Any) -> None:
        return None

    def write(self, *args: Any, **kwargs: Any) -> None:
        return None

    def caption(self, *args: Any, **kwargs: Any) -> None:
        return None

    def info(self, *args: Any, **kwargs: Any) -> None:
        return None

    def success(self, *args: Any, **kwargs: Any) -> None:
        return None

    def warning(self, *args: Any, **kwargs: Any) -> None:
        return None

    def error(self, *args: Any, **kwargs: Any) -> None:
        return None

    def text(self, *args: Any, **kwargs: Any) -> None:
        return None

    def code(self, *args: Any, **kwargs: Any) -> None:
        return None

    def divider(self) -> None:
        return None

    def metric(self, *args: Any, **kwargs: Any) -> None:
        return None

    def image(self, *args: Any, **kwargs: Any) -> None:
        return None

    def dataframe(self, *args: Any, **kwargs: Any) -> None:
        return None

    def bar_chart(self, *args: Any, **kwargs: Any) -> None:
        return None

    def progress(self, *args: Any, **kwargs: Any) -> None:
        return None

    def columns(self, spec: Any, *args: Any, **kwargs: Any) -> list[DummyContext]:
        count = spec if isinstance(spec, int) else len(spec)
        return [DummyContext() for _ in range(count)]

    def tabs(self, labels: list[str]) -> list[DummyContext]:
        return [DummyContext() for _ in labels]

    def expander(self, *args: Any, **kwargs: Any) -> DummyContext:
        return DummyContext()

    def form(self, *args: Any, **kwargs: Any) -> DummyContext:
        return DummyContext()

    def selectbox(self, label: str, options: Any, index: int = 0, key: str | None = None, **kwargs: Any) -> Any:
        values = list(options)
        if key and key in self.session_state:
            return self.session_state[key]
        value = values[index] if values else None
        if key:
            self.session_state[key] = value
        return value

    def radio(self, label: str, options: Any, index: int = 0, key: str | None = None, **kwargs: Any) -> Any:
        values = list(options)
        if key and key in self.session_state:
            return self.session_state[key]
        value = values[index] if values else None
        if key:
            self.session_state[key] = value
        return value

    def text_input(self, label: str, value: str = "", key: str | None = None, **kwargs: Any) -> str:
        if key and key in self.session_state:
            return str(self.session_state[key])
        if key:
            self.session_state[key] = value
        return value

    def text_area(self, label: str, value: str = "", key: str | None = None, **kwargs: Any) -> str:
        if key and key in self.session_state:
            return str(self.session_state[key])
        if key:
            self.session_state[key] = value
        return value

    def slider(self, label: str, min_value: int, max_value: int, value: int, **kwargs: Any) -> int:
        return value

    def checkbox(self, *args: Any, **kwargs: Any) -> bool:
        return False

    def file_uploader(self, *args: Any, **kwargs: Any) -> None:
        return None

    def button(self, *args: Any, **kwargs: Any) -> bool:
        return False

    def form_submit_button(self, *args: Any, **kwargs: Any) -> bool:
        return False

    def download_button(self, *args: Any, **kwargs: Any) -> bool:
        return False


PAGES = [
    "Home",
    "Published Library",
    "Submit / Write",
    "Reviewer Desk",
    "Editorial Office",
    "About",
]


def run_static_execution_test() -> dict[str, object]:
    fake = FakeStreamlit()
    sys.modules["streamlit"] = fake

    completed: list[str] = []
    with tempfile.TemporaryDirectory() as tmp:
        os.environ["JOURNAL_DB_PATH"] = str(Path(tmp) / "static-execution.db")
        for page in PAGES:
            fake.session_state.clear()
            fake.session_state["primary_nav"] = page
            fake.query_params.clear()
            runpy.run_path(str(ROOT / "app.py"), run_name=f"__streamlit_static_{page.replace(' ', '_')}__")
            completed.append(page)

    return {"pages_executed": completed, "page_count": len(completed)}


if __name__ == "__main__":
    summary = run_static_execution_test()
    print("APP STATIC EXECUTION TEST PASSED")
    for key, value in summary.items():
        print(f"{key}: {value}")
