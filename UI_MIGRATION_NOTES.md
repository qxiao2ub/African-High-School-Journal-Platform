# UI Migration Notes

## Source design

The user-supplied UI package was a Vite + React + TypeScript project using Tailwind CSS, shadcn-style components, React Router, and custom journal imagery.

The design source is preserved at:

```text
ui_design_reference/react_vite_prototype/
```

## Migration strategy

The journal cannot deploy a standalone React interface through a normal Streamlit `app.py` entrypoint without maintaining two separate web applications. The design was therefore translated into native Streamlit layouts plus a custom CSS presentation layer.

## Components migrated

| React design element | Streamlit implementation |
|---|---|
| Journal seal and centered masthead | `render_masthead()` in `journal_platform/ui.py` |
| Cream/navy/gold theme | `.streamlit/config.toml` plus custom CSS variables |
| Sticky editorial navigation | horizontal Streamlit navigation control |
| Classroom hero image | responsive base64-backed hero banner |
| Editorial article cards | `render_article_card()` |
| Newspaper workflow columns | `render_workflow()` |
| Feature and technology cards | `render_feature_grid()` and `render_tech_stack()` |
| Responsive publication pages | Streamlit columns, expanders, forms, and download controls |
| Journal footer | `render_footer()` |
| React article and staff imagery | copied to `assets/` and used in the Streamlit home/library views |

## Functional integration

The migrated UI is connected to the existing Python functionality rather than serving as a static mockup. It supports:

- manuscript upload and online writing;
- local NLP similarity screening;
- AI reviewer matching;
- reviewer assignments and feedback;
- editorial status management;
- electronic publication and search;
- CSV and publication downloads.

## Streamlit deployment

Only these root files are required by Streamlit Community Cloud:

- `app.py`
- `requirements.txt`
- `journal_platform/`
- `data/`
- `assets/`
- `schema.sql`
- `.streamlit/config.toml`

The `ui_design_reference/` folder is included for traceability and future design work. It is not imported by `app.py`.


## Streamlit Markdown rendering repair

Streamlit's Markdown renderer treats a blank line as the end of some raw-HTML blocks. The original repeated workflow and feature-card templates inserted blank lines between sibling `<div>` elements, so the first card rendered while the remaining markup was displayed as indented code. The fixed implementation generates each grid as compact, uninterrupted HTML. The regression test checks that the workflow contains five card nodes, the feature area contains six card nodes, and neither payload contains blank-line parser boundaries.
