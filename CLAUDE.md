# hayashi.in — personal website

Source for **https://hayashi.in**, the personal website of Soichi Hayashi.

Built with the **Navfolio** Astro theme (https://github.com/dodolalorc/astro-navfolio,
MIT © dodolalorc), deployed to **GitHub Pages** via GitHub Actions. Navfolio is a
portfolio-first publishing platform: a home dashboard, blog, projects, "vibe" short notes,
full-text search (Pagefind), RSS, and light/dark theming.

## Golden rule: everything here is PUBLIC

The repository is **public** and everything the site serves is world-readable.
- Only put information here meant to be seen by the entire world.
- Never add secrets, API keys, tokens, private addresses, unpublished work, or anything the
  owner would not post publicly — not in source, output, or git history.
- If a request would put non-public information into the repo, stop and flag it.

## Toolchain

Requires **Bun** (https://bun.sh) and **Node ≥ 22.12**. Bun is the package manager and
runs the build.

```sh
bun install                 # install deps (uses bun.lock)
bun run dev                 # local dev server (http://localhost:4321)
bun run build               # static build -> dist/  (astro build + Pagefind index)
bun run preview             # preview the production build
```

Local build gotchas (already handled, keep in mind):
- The upstream theme is bilingual EN/CN and its `build` script ran a Chinese-font
  subsetting step (`fonts:ui`) that **errors when there is no CJK text**. This site is
  English-only, so that step was **removed** from the `build` script in `package.json`.
  Keep content English; don't re-add `fonts:ui` to the build.
- For a production-parity local build, pass the same env the CI uses:
  `SITE_URL=https://hayashi.in SITE_BASE=/ bun run build`.

## Workflow

1. Edit **config** (`src/config/site.toml`) and/or **content** (`src/content/**`).
2. Preview with `bun run dev` (or build + `bun run preview`).
3. Commit source. **Ask before pushing to `main`.**
4. Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with Bun and
   deploys `dist/` to GitHub Pages. Do **not** commit `dist/` (git-ignored).

## Where things live

```
src/config/site.toml   Profile, top nav, homepage modules, palette, links, search, comments
src/content/about.mdx  About page
src/content/blog/      Blog posts        (scaffold a post: `bun run post:new`)
src/content/projects/  Project writeups
src/content/vibe/      Short notes       (scaffold: `bun run vibe:new`)
src/content.config.ts  Content collection schemas + config schema/validation
src/layouts/           Page shells (BaseLayout, BlogPost, BlogArticle)
src/components/         Theme components (cards, widgets, header/footer, mdx helpers)
src/pages/             Routes (index, about, blog/*, projects, vibe, tags, rss, 404)
src/styles/            global.css, palettes.css, fonts.css
public/                Static assets served from site root
public/images/         Images, incl. soichi.avatar.png (the profile avatar)
public/CNAME           Custom domain — do NOT delete (see Deployment)
```

## Editing conventions

- **Profile / homepage / palette**: edit `src/config/site.toml`.
  - `palette` is `blue-soft` (options in the comment there / `src/content.config.ts`).
  - Keep `[[config.home.links]]` to public links only (currently GitHub, Email, RSS).
  - **IntroCard quirk**: the home hero hardcodes a leading accent "Hi," and renders
    `intro.title` with `intro.name` stripped out, then re-adds `intro.name` as an italic
    accent. So `intro.title` **must contain the full `intro.name`** or the name doubles up.
    Current: `title = "I'm Soichi Hayashi"`, `name = "Soichi Hayashi"` → "Hi, I'm *Soichi
    Hayashi*".
- **Pages/posts**: Markdown/MDX in `src/content/**` with frontmatter (see existing files
  for the shape). Content is English; the page language is `en` (theme default was
  `zh-CN` — do not reintroduce it).
- **Images / static files**: put in `public/` (optimize large images first).
- You may edit theme components, styles, `astro.config.mjs`, or `site.toml` schema when a
  request needs it. Keep output clean, accessible, responsive; keep builds deterministic.
  After changes, run `bun run build` and confirm it succeeds.

## Deployment (facts — keep these true)

- Host: **GitHub Pages**, repo `soichih/hayashi.in`. Pages source = **GitHub Actions**
  (build type: workflow), via `.github/workflows/deploy.yml` (Bun install →
  `bun run build` with `SITE_URL=https://hayashi.in`, `SITE_BASE=/` →
  `upload-pages-artifact` → `deploy-pages`).
- Custom domain: **hayashi.in** (apex). Set via `public/CNAME` (copied into `dist/`) and the
  Pages custom-domain setting. GoDaddy DNS: `A` → 185.199.108–111.153,
  `AAAA` → 2606:50c0:8000–8003::153, `www` CNAME → `soichih.github.io`. HTTPS enforced once
  GitHub issues the cert.
- Deploying = pushing to `main`. **Ask before pushing.** Pushing directly to the default
  branch is also gated by the harness.
- `LICENSE` is the theme's MIT license — keep it for attribution.
