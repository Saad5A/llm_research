"""Restore pages.html from original UTF-8 index.html in git history."""
import subprocess
from pathlib import Path

content = subprocess.check_output(["git", "show", "eb4801a:index.html"]).decode("utf-8")
start = content.index('<div class="page active" id="page-intro">')
end = content.index("<!-- Scripts -->")
pages = content[start:end].strip()

# Keep benchmark table scroll wrapper from current version
pages = pages.replace(
    '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden">',
    '<div class="bench-table-wrap">',
)

out = Path("src/pages/templates/pages.html")
out.write_text(pages, encoding="utf-8", newline="\n")
print(f"Wrote {len(pages)} chars to {out}")
