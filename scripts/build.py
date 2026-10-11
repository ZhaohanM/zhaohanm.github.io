"""Build the dependency-free homepage into docs/ for GitHub Pages."""
from pathlib import Path
from html.parser import HTMLParser
import shutil
import hashlib
import json

ROOT = Path(__file__).resolve().parent.parent


class CheckPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.anchors = []
        self.translation_keys = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href", "").startswith("#"):
            self.anchors.append(attrs["href"][1:])
        for attribute in ("data-i18n", "data-i18n-aria-label", "data-i18n-alt", "data-i18n-content"):
            if attribute in attrs:
                self.translation_keys.append(attrs[attribute])


def main():
    template = (ROOT / "template.html").read_text()
    content = (ROOT / "content.html").read_text()
    chinese = json.loads((ROOT / "translations.zh.json").read_text())
    chinese["content"] = (ROOT / "content.zh.html").read_text()
    assert template.count("<!-- CONTENT -->") == 1
    assert template.count("<!-- TRANSLATIONS -->") == 1
    page = template.replace("<!-- CONTENT -->", content)
    # Escape '<' so authored content cannot terminate the JSON script element.
    page = page.replace("<!-- TRANSLATIONS -->", json.dumps(chinese, ensure_ascii=False).replace("<", "\\u003c"))
    for asset in ("styles.css", "site.js", "avatar.png"):
        version = hashlib.sha256((ROOT / "assets" / asset).read_bytes()).hexdigest()[:12]
        page = page.replace(f'assets/{asset}"', f'assets/{asset}?v={version}"')
    checker = CheckPage()
    checker.feed(page)
    assert len(checker.ids) == len(set(checker.ids)), "Duplicate section IDs"
    assert set(checker.anchors) <= set(checker.ids), "Navigation has missing targets"
    assert set(checker.translation_keys) == set(chinese), "Translation keys do not match the template"
    english_content, chinese_content = CheckPage(), CheckPage()
    english_content.feed(content)
    chinese_content.feed(chinese["content"])
    assert english_content.ids == chinese_content.ids, "Translated sections do not match English sections"
    for forbidden in ("YOUR_EMAIL", "example.com", "googletagmanager.com"):
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
