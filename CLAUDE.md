# hayashi.in — personal website

Source for the personal website **https://hayashi.in**, built with **Astro** and deployed
to **GitHub Pages** via GitHub Actions.

The site is agent-friendly by design: a human (or Claude Code) edits human-readable
**source** — Markdown content, a small config file, and a couple of Astro templates — and a
**deterministic** Astro build compiles it into static HTML/CSS/JS. Claude Code's role is to
author content, adjust templates/styles, and evolve the engine config — *not* to hand-write
the final HTML. The compile step is done by Astro, reproducibly, so builds don't drift.

## Golden rule: everything here is PUBLIC

The repository is **public** and everything the site serves is world-readable.
- Only put information here that is meant to be seen by the entire world.
- Never add secrets, API keys, tokens, private addresses, unpublished work, or anything the
  owner would not post publicly — not in source, not in build output, not in git history.
- If a request would put non-public information into the repo, stop and flag it.

## Workflow

1. Edit **source**: `src/pages/*.md` (content), `src/data/site.js` (config),
   `src/layouts/*.astro` and `src/styles/*.css` (templates/styles).
2. Preview locally: `npm run dev` (http://localhost:4321).
3. Build: `npm run build` → static output in `dist/` (git-ignored). Sanity-check the build.
4. Commit source. **Ask before pushing to `main`.**
5. Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with Astro and
   deploys `dist/` to GitHub Pages at https://hayashi.in.

You do **not** commit `dist/` — GitHub Actions builds it. The repo holds source only.

## Layout

```
hayashi.in/
├── CLAUDE.md                     # this file
├── package.json                  # Astro + scripts (dev/build/preview)
├── astro.config.mjs              # Astro config (site = https://hayashi.in)
│
├── src/
│   ├── pages/                    # CONTENT — one Markdown file per page (a route)
│   │   ├── index.md              #   -> /
│   │   └── about.md              #   -> /about
│   ├── layouts/
│   │   └── BaseLayout.astro      # page shell: head, header/nav, footer
│   ├── data/
│   │   └── site.js               # site-wide config: title, nav, links, location
│   └── styles/
│       └── global.css            # theme (dark teal, Cormorant Garamond serif)
│
├── public/                       # copied verbatim into the build output
│   └── CNAME                     # custom domain — do NOT delete (see Deployment)
│
├── .github/workflows/deploy.yml  # builds + deploys to Pages on push to main
└── dist/                         # GENERATED build output (git-ignored, do not commit)
```

## Adding / editing content

- **A new page**: add `src/pages/<slug>.md` with frontmatter, then add it to `nav` in
  `src/data/site.js` if it should appear in the menu.
  ```markdown
  ---
  layout: ../layouts/BaseLayout.astro
  title: Projects
  ---

  # Projects

  Body in Markdown…
  ```
  The file's location sets the route: `src/pages/projects.md` → `/projects`. `index.md` → `/`.
- **Internal links** use Astro routes, not `.html`: link to `/about`, not `about.html`.
- **Site config** (name, tagline, nav, links, location) lives in `src/data/site.js`.
- **Static files** (images, favicon, etc.) go in `public/` and are served from the site root.

## Editing templates / styles / the engine

- `src/layouts/BaseLayout.astro` is the shared page shell. Edit it to change head tags,
  header, nav, or footer for every page.
- `src/styles/global.css` holds the theme via CSS custom properties (`--bg`, `--text`,
  `--accent`, `--muted`, `--border`). Change colors/typography there.
- You may edit `astro.config.mjs`, add Astro integrations, or restructure the engine when a
  request calls for it — this is expected. Keep the build deterministic and keep output
  clean, semantic, accessible, and responsive. Prefer minimal JS; the site must work
  without it. Don't add trackers/analytics unless the owner asks.
- After any change, run `npm run build` and confirm it succeeds and internal links resolve.

## Deployment (facts — keep these true)

- Host: **GitHub Pages**, repo `soichih/hayashi.in`. Pages source = **GitHub Actions**
  (build type: workflow), driven by `.github/workflows/deploy.yml`
  (`withastro/action` build + `actions/deploy-pages`).
- Custom domain: **hayashi.in** (apex). Set via `public/CNAME` (copied into `dist/`) and the
  Pages custom-domain setting. GoDaddy DNS: `A` → 185.199.108–111.153,
  `AAAA` → 2606:50c0:8000–8003::153, `www` CNAME → `soichih.github.io`. HTTPS enforced once
  GitHub issues the cert.
- Deploying = pushing to `main` (the workflow does the rest). **Ask before pushing.**
  Pushing directly to the default branch is also gated by the harness.
