"""Build the dependency-free homepage into docs/ for GitHub Pages."""
from pathlib import Path
from html.parser import HTMLParser
import shutil
import hashlib

ROOT = Path(__file__).resolve().parent.parent


class CheckPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.anchors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href", "").startswith("#"):
            self.anchors.append(attrs["href"][1:])


def main():
    template = (ROOT / "template.html").read_text()
    content = (ROOT / "content.html").read_text()
    assert template.count("<!-- CONTENT -->") == 1
    page = template.replace("<!-- CONTENT -->", content)
    for asset in ("styles.css", "site.js"):
        version = hashlib.sha256((ROOT / "assets" / asset).read_bytes()).hexdigest()[:12]
        page = page.replace(f'assets/{asset}"', f'assets/{asset}?v={version}"')
    checker = CheckPage()
    checker.feed(page)
    assert len(checker.ids) == len(set(checker.ids)), "Duplicate section IDs"
    assert set(checker.anchors) <= set(checker.ids), "Navigation has missing targets"
    for forbidden in ("YOUR_EMAIL", "example.com", "mapmyvisitors.com", "googletagmanager.com"):
        assert forbidden not in page, f"Unexpected template content: {forbidden}"
    output = ROOT / "docs"
    output.mkdir(exist_ok=True)
    (output / "index.html").write_text(page)
    shutil.copytree(ROOT / "assets", output / "assets", dirs_exist_ok=True)
    (output / ".nojekyll").touch()
    (output / "robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: https://zhaohanm.github.io/sitemap.xml\n")
    (output / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://zhaohanm.github.io/</loc></url></urlset>\n')
    print(f"Built {output / 'index.html'}; {len(checker.ids)} unique anchors checked.")


if __name__ == "__main__":
    main()
