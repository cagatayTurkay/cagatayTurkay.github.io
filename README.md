# Personal academic website

A plain Jekyll site that GitHub Pages builds for you — no theme, no plugins, no build step on your machine.

```
_config.yml            ← name, email, links, baseurl
_data/
  navigation.yml       ← top menu
  news.yml             ← news items (home page shows the newest 6)
  projects.yml         ← research projects (current: true / false)
  people.yml           ← students, researchers, alumni
_layouts/default.html  ← the one page template (header, nav, footer)
index.md               ← About / home
research.md
publications.md
people.md
teaching.md
assets/
  papers.bib           ← ALL publications – the site reads this directly
  css/style.css        ← colours & fonts at the top (:root)
  js/publications.js   ← BibTeX → list (search, type filters, BibTeX toggle)
  img/profile.jpg      ← replace with your photo (square works best)
  pdf/                 ← optional: put paper PDFs here
docs/bib-cleanup-notes.md  ← what was removed/changed from the original .bib
```

## Put it online (once)

1. Create a GitHub repo. Naming it **`<username>.github.io`** gives you `https://<username>.github.io/`.
   Any other name (e.g. `website`) gives `https://<username>.github.io/website/` — then set `baseurl: "/website"` in `_config.yml`.
2. Set `url:` in `_config.yml` to your address.
3. Push these files to the `main` branch.
4. Repo → **Settings → Pages** → *Build and deployment*: Source = **Deploy from a branch**, Branch = `main`, folder `/ (root)`.
5. Wait a minute or two; the address appears at the top of the Pages settings.

Custom domain later? Settings → Pages → Custom domain, and add the DNS record GitHub shows you.

## Everyday updates

| To… | Edit |
|---|---|
| Add a paper | paste the BibTeX into `assets/papers.bib` (keys must be unique) |
| Feature a paper on the home page | add `selected = {true},` to its entry |
| Add PDF / code / video / slides links | add `pdf = {...}`, `code = {...}`, `video = {...}`, `slides = {...}`, `doi = {...}` or `url = {...}` |
| Mark an award | `award = {Best Paper Award},` |
| Add news | new item at the top of `_data/news.yml` |
| Add a student | `_data/people.yml` |
| Add a project | `_data/projects.yml` |
| Add a page | create `newpage.md` with the front matter below, and add it to `_data/navigation.yml` |

```yaml
---
layout: default
title: Talks
permalink: /talks/
---
Your content in Markdown.
```

You can do all of this in the GitHub web editor (press `.` in the repo to open it) — no local setup needed.

Link to a single paper with `/publications/#<bibkey>`, e.g. `/publications/#henkin2022words`; the entry is highlighted.

## Preview locally (optional)

```bash
gem install bundler jekyll
jekyll serve        # then open http://localhost:4000
```

Opening the HTML files directly won't work, because the publications list is fetched from `papers.bib`.

## Things to fill in

- [ ] `url:` in `_config.yml`
- [ ] your photo at `assets/img/profile.jpg`
- [ ] ORCID / GitHub / Bluesky links (commented out in `_config.yml`)
- [ ] real entries in `_data/people.yml` (everything there is a placeholder)
- [ ] latest news in `_data/news.yml` (check the dates on the existing items)
- [ ] which papers are `selected` (currently the 10 from your Warwick page – nothing after 2022)
- [ ] the five entries listed under "need your check" in `docs/bib-cleanup-notes.md`
