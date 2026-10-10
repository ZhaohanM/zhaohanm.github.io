# Zhaohan Meng — personal homepage

A lightweight academic homepage for https://zhaohanm.github.io/, adapted to the layout of [Yubao Tang’s homepage](https://yubaotang11.github.io/).

## Update content

- `content.html`: biography, research interests, news, publications, experience, education, honors, service and technical skills.
- `template.html`: sidebar, social links, navigation, page metadata and last-updated date.
- `assets/avatar.png`: profile photograph.
- `assets/Zhaohan_Meng_CV.pdf`: downloadable CV; replace this file when the CV is updated.
- `assets/styles.css`: desktop and mobile styling.

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

## Sources and attribution

Professional content is based on the owner’s supplied CV and public academic/GitHub profiles. See `CONTENT_SOURCES.md` for editorial notes.

Design reference: [Yubao Tang](https://yubaotang11.github.io/) / [source](https://github.com/yubaotang11/yubaotang11.github.io), from [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io). The reference’s MIT license is retained in `LICENSE`. This adaptation uses a small standalone HTML/CSS/JavaScript implementation, without the original site’s analytics or visitor widgets.
