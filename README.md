# Zhaohan Meng — personal homepage

A lightweight academic homepage for https://zhaohanm.github.io/.

## Update content

- `content.html`: biography, research interests, news, publications, experience, education, honors, community, mentoring and service.
- `content.zh.html`: matching Chinese content; keep section IDs, dates and links in sync with the English version.
- `translations.zh.json`: Chinese navigation, profile, footer and metadata strings.
- `template.html`: sidebar, social links, navigation, page metadata and last-updated date.
- `assets/avatar.png`: profile photograph.
- `assets/Zhaohan_Meng_CV.pdf`: downloadable CV; replace this file when the CV is updated.
- `assets/styles.css`: desktop and mobile styling.
- `assets/site.js`: navigation, language switching and the introductory text animation. English is the default; the header button switches the full page and remembers the choice in local browser storage. The original CV PDF and publication titles remain in English.
- The footer uses the homepage's MapMyVisitors image widget to display pageviews and approximate visitor locations; its embed URL is in `template.html`.

After making changes, generate the published files:

```sh
python3 scripts/build.py
```

Preview locally:

```sh
python3 -m http.server 8765 --directory docs --bind 127.0.0.1
```

Open http://127.0.0.1:8765. Commit both the source files and the generated `docs/` files.

## GitHub Pages

The repository is `ZhaohanM/zhaohanm.github.io`. Configure **Settings → Pages → Deploy from a branch → main → /docs**. GitHub publishes the committed static files; no Ruby, Node.js, package installation, or API credentials are needed.

## Content sources

Professional content is based on the owner’s supplied CV and public academic/GitHub profiles. See `CONTENT_SOURCES.md` for editorial notes.
